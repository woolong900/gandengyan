#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>
#import <objc/message.h>
#import <objc/runtime.h>

static IMP qjOriginalDownloadRecordedFile = NULL;
static IMP qjOriginalPlayRecordedFile = NULL;
static IMP qjOriginalStopPlayFile = NULL;
static AVAudioRecorder *qjRecorder = nil;
static AVAudioPlayer *qjPlayer = nil;
static BOOL qjLastDownloadIsLocal = NO;

static NSString *qjVoiceBaseURL(void) {
    NSString *baseURL = [NSBundle.mainBundle objectForInfoDictionaryKey:@"QJQPVoiceBaseURL"];
    if (![baseURL isKindOfClass:NSString.class] || baseURL.length == 0) baseURL = @"https://game.auxvv.com";
    return [baseURL stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"/"]];
}

static NSString *qjRecordPath(void) {
    return [NSTemporaryDirectory() stringByAppendingPathComponent:@"qjqp_voice_record.m4a"];
}

static NSString *qjDownloadPath(void) {
    return [NSTemporaryDirectory() stringByAppendingPathComponent:@"qjqp_voice_download.m4a"];
}

static BOOL qjIsM4A(NSData *data) {
    if (data.length < 12) return NO;
    const unsigned char *bytes = data.bytes;
    return memcmp(bytes + 4, "ftyp", 4) == 0;
}

static id qjVoiceDelegate(void) {
    Class voiceDelegateClass = NSClassFromString(@"GCloudVoice");
    SEL getInstance = NSSelectorFromString(@"getInstance");
    if (!voiceDelegateClass || ![voiceDelegateClass respondsToSelector:getInstance]) return nil;
    return ((id (*)(id, SEL))objc_msgSend)(voiceDelegateClass, getInstance);
}

static void qjNotifyUpload(NSString *fileID, NSString *filePath, BOOL success) {
    dispatch_async(dispatch_get_main_queue(), ^{
        id delegate = qjVoiceDelegate();
        SEL callback = NSSelectorFromString(@"onUploadFile:withFilePath:andFileID:");
        if (![delegate respondsToSelector:callback]) return;
        ((void (*)(id, SEL, int, const char *, const char *))objc_msgSend)(
            delegate, callback, success ? 11 : -1, filePath.UTF8String, fileID.UTF8String
        );
    });
}

static void qjNotifyDownload(NSString *fileID, NSString *filePath, BOOL success) {
    dispatch_async(dispatch_get_main_queue(), ^{
        id delegate = qjVoiceDelegate();
        SEL callback = NSSelectorFromString(@"onDownloadFile:withFilePath:andFileID:");
        if (![delegate respondsToSelector:callback]) return;
        ((void (*)(id, SEL, int, const char *, const char *))objc_msgSend)(
            delegate, callback, success ? 13 : -1, filePath.UTF8String, fileID.UTF8String
        );
    });
}

static id qjStartRecording(__unused id self, __unused SEL command) {
    AVAudioSession *session = AVAudioSession.sharedInstance;
    if (session.recordPermission != AVAudioSessionRecordPermissionGranted) {
        if (session.recordPermission == AVAudioSessionRecordPermissionUndetermined) {
            [session requestRecordPermission:^(__unused BOOL granted) {}];
        }
        return @"fail";
    }
    NSError *error = nil;
    AVAudioSessionCategoryOptions options = AVAudioSessionCategoryOptionDefaultToSpeaker |
                                            AVAudioSessionCategoryOptionAllowBluetoothHFP;
    [session setCategory:AVAudioSessionCategoryPlayAndRecord mode:AVAudioSessionModeDefault options:options error:&error];
    if (!error) [session setActive:YES error:&error];
    if (error) return @"fail";

    qjPlayer = nil;
    qjRecorder = nil;
    NSString *filePath = qjRecordPath();
    [NSFileManager.defaultManager removeItemAtPath:filePath error:nil];
    NSDictionary *settings = @{
        AVFormatIDKey: @(kAudioFormatMPEG4AAC),
        AVSampleRateKey: @16000,
        AVNumberOfChannelsKey: @1,
        AVEncoderBitRateKey: @24000,
        AVEncoderAudioQualityKey: @(AVAudioQualityMedium),
    };
    qjRecorder = [[AVAudioRecorder alloc] initWithURL:[NSURL fileURLWithPath:filePath] settings:settings error:&error];
    if (error || ![qjRecorder prepareToRecord] || ![qjRecorder record]) {
        qjRecorder = nil;
        return @"fail";
    }
    return @"ok";
}

static id qjStopRecording(__unused id self, __unused SEL command) {
    if (!qjRecorder || !qjRecorder.isRecording) return @"fail";
    [qjRecorder stop];
    qjRecorder = nil;
    NSData *data = [NSData dataWithContentsOfFile:qjRecordPath()];
    return qjIsM4A(data) ? @"ok" : @"fail";
}

static id qjUploadRecordedFile(__unused id self, __unused SEL command) {
    NSString *filePath = qjRecordPath();
    NSData *voiceData = [NSData dataWithContentsOfFile:filePath];
    if (!qjIsM4A(voiceData)) {
        qjNotifyUpload(@"", filePath, NO);
        return @"fail";
    }
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@/voice", qjVoiceBaseURL()]];
    if (!url) {
        qjNotifyUpload(@"", filePath, NO);
        return @"fail";
    }
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"POST";
    request.timeoutInterval = 12;
    request.HTTPBody = voiceData;
    [request setValue:@"application/octet-stream" forHTTPHeaderField:@"Content-Type"];
    NSURLSessionDataTask *task = [NSURLSession.sharedSession dataTaskWithRequest:request
        completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            NSInteger status = [(NSHTTPURLResponse *)response statusCode];
            NSDictionary *json = data.length ? [NSJSONSerialization JSONObjectWithData:data options:0 error:nil] : nil;
            NSString *fileID = [json[@"id"] isKindOfClass:NSString.class] ? json[@"id"] : @"";
            BOOL ok = !error && status == 200 && [json[@"err_code"] integerValue] == 0 && [fileID hasPrefix:@"qjqp:"];
            qjNotifyUpload(fileID, filePath, ok);
        }];
    [task resume];
    return @"ok";
}

static id qjDownloadRecordedFile(id self, SEL command, id value) {
    NSString *fileID = [value isKindOfClass:NSString.class] ? value : nil;
    if (!fileID || ![fileID hasPrefix:@"qjqp:"]) {
        qjLastDownloadIsLocal = NO;
        return ((id (*)(id, SEL, id))qjOriginalDownloadRecordedFile)(self, command, value);
    }
    NSString *identifier = [fileID substringFromIndex:5];
    NSCharacterSet *invalid = [[NSCharacterSet characterSetWithCharactersInString:@"0123456789abcdef"] invertedSet];
    if (identifier.length != 32 || [identifier rangeOfCharacterFromSet:invalid].location != NSNotFound) return @"fail";

    qjLastDownloadIsLocal = YES;
    NSString *filePath = qjDownloadPath();
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@/voice/%@", qjVoiceBaseURL(), identifier]];
    if (!url) return @"fail";
    NSURLSessionDataTask *task = [NSURLSession.sharedSession dataTaskWithURL:url
        completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            NSInteger status = [(NSHTTPURLResponse *)response statusCode];
            BOOL ok = !error && status == 200 && qjIsM4A(data) && [data writeToFile:filePath atomically:YES];
            qjNotifyDownload(fileID, filePath, ok);
        }];
    [task resume];
    return @"ok";
}

static id qjPlayRecordedFile(id self, SEL command) {
    if (!qjLastDownloadIsLocal) return ((id (*)(id, SEL))qjOriginalPlayRecordedFile)(self, command);
    NSError *error = nil;
    qjPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:[NSURL fileURLWithPath:qjDownloadPath()] error:&error];
    if (error || ![qjPlayer prepareToPlay] || ![qjPlayer play]) {
        qjPlayer = nil;
        return @"fail";
    }
    return @"ok";
}

static id qjStopPlayFile(id self, SEL command) {
    if (!qjPlayer) return ((id (*)(id, SEL))qjOriginalStopPlayFile)(self, command);
    [qjPlayer stop];
    qjPlayer = nil;
    return @"ok";
}

static void qjReplaceClassMethod(Class voiceClass, NSString *name, IMP replacement, IMP *original) {
    Method method = class_getClassMethod(voiceClass, NSSelectorFromString(name));
    if (!method) return;
    if (original) *original = method_getImplementation(method);
    class_replaceMethod(object_getClass(voiceClass), method_getName(method), replacement, method_getTypeEncoding(method));
}

static void qjInstallVoiceFix(void) {
    Class voiceClass = NSClassFromString(@"Voice");
    if (!voiceClass) return;
    qjReplaceClassMethod(voiceClass, @"startRecording", (IMP)qjStartRecording, NULL);
    qjReplaceClassMethod(voiceClass, @"stopRecording", (IMP)qjStopRecording, NULL);
    qjReplaceClassMethod(voiceClass, @"uploadRecordedFile", (IMP)qjUploadRecordedFile, NULL);
    qjReplaceClassMethod(voiceClass, @"downloadRecordedFile:", (IMP)qjDownloadRecordedFile, &qjOriginalDownloadRecordedFile);
    qjReplaceClassMethod(voiceClass, @"playRecordedFile", (IMP)qjPlayRecordedFile, &qjOriginalPlayRecordedFile);
    qjReplaceClassMethod(voiceClass, @"stopPlayFile", (IMP)qjStopPlayFile, &qjOriginalStopPlayFile);
}

__attribute__((constructor)) static void qjVoiceFixEntry(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        qjInstallVoiceFix();
        AVAudioSession *session = AVAudioSession.sharedInstance;
        if (session.recordPermission == AVAudioSessionRecordPermissionUndetermined) {
            [session requestRecordPermission:^(__unused BOOL granted) {}];
        }
    });
}
