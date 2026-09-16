#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>
#import <objc/message.h>
#import <objc/runtime.h>

static IMP qjOriginalDownloadRecordedFile = NULL;
static IMP qjOriginalUploadRecordedFile = NULL;

static NSString *qjVoiceBaseURL(void) {
    NSString *baseURL = [NSBundle.mainBundle objectForInfoDictionaryKey:@"QJQPVoiceBaseURL"];
    if (![baseURL isKindOfClass:NSString.class] || baseURL.length == 0) baseURL = @"https://game.auxvv.com";
    return [baseURL stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"/"]];
}

static void qjNotifyUpload(NSString *fileID, NSString *filePath) {
    dispatch_async(dispatch_get_main_queue(), ^{
        Class voiceDelegateClass = NSClassFromString(@"GCloudVoice");
        SEL getInstance = NSSelectorFromString(@"getInstance");
        SEL callback = NSSelectorFromString(@"onUploadFile:withFilePath:andFileID:");
        if (!voiceDelegateClass || ![voiceDelegateClass respondsToSelector:getInstance]) return;
        id delegate = ((id (*)(id, SEL))objc_msgSend)(voiceDelegateClass, getInstance);
        if (![delegate respondsToSelector:callback]) return;
        ((void (*)(id, SEL, int, const char *, const char *))objc_msgSend)(
            delegate, callback, 11, filePath.UTF8String, fileID.UTF8String
        );
    });
}

static void qjNotifyDownload(NSString *fileID, NSString *filePath, BOOL success) {
    dispatch_async(dispatch_get_main_queue(), ^{
        Class voiceDelegateClass = NSClassFromString(@"GCloudVoice");
        SEL getInstance = NSSelectorFromString(@"getInstance");
        SEL callback = NSSelectorFromString(@"onDownloadFile:withFilePath:andFileID:");
        if (!voiceDelegateClass || ![voiceDelegateClass respondsToSelector:getInstance]) return;
        id delegate = ((id (*)(id, SEL))objc_msgSend)(voiceDelegateClass, getInstance);
        if (![delegate respondsToSelector:callback]) return;
        ((void (*)(id, SEL, int, const char *, const char *))objc_msgSend)(
            delegate,
            callback,
            success ? 13 : -1,
            filePath.UTF8String,
            fileID.UTF8String
        );
    });
}

static id qjDownloadRecordedFile(id self, SEL command, id value) {
    NSString *fileID = [value isKindOfClass:NSString.class] ? value : nil;
    if (!fileID || ![fileID hasPrefix:@"qjqp:"]) {
        return ((id (*)(id, SEL, id))qjOriginalDownloadRecordedFile)(self, command, value);
    }

    NSString *identifier = [fileID substringFromIndex:5];
    NSCharacterSet *invalid = [[NSCharacterSet characterSetWithCharactersInString:@"0123456789abcdef"] invertedSet];
    if (identifier.length != 32 || [identifier rangeOfCharacterFromSet:invalid].location != NSNotFound) {
        return @"fail";
    }

    NSString *baseURL = qjVoiceBaseURL();
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@/voice/%@", baseURL, identifier]];

    SEL pathSelector = NSSelectorFromString(@"getDownloadVoiceFilePath");
    const char *rawPath = ((const char *(*)(id, SEL))objc_msgSend)(self, pathSelector);
    NSString *filePath = rawPath ? [NSString stringWithUTF8String:rawPath] : nil;
    if (!url || filePath.length == 0) return @"fail";

    NSURLSessionDataTask *task = [NSURLSession.sharedSession dataTaskWithURL:url
        completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            NSInteger status = [(NSHTTPURLResponse *)response statusCode];
            BOOL silk = data.length >= 6 && memcmp(data.bytes, "#!SILK", 6) == 0;
            BOOL ok = !error && status == 200 && silk && [data writeToFile:filePath atomically:YES];
            qjNotifyDownload(fileID, filePath, ok);
        }];
    [task resume];
    return @"ok";
}

static id qjUploadRecordedFile(id self, SEL command) {
    SEL pathSelector = NSSelectorFromString(@"getSaveVoiceFilePath");
    const char *rawPath = ((const char *(*)(id, SEL))objc_msgSend)(self, pathSelector);
    NSString *filePath = rawPath ? [NSString stringWithUTF8String:rawPath] : nil;
    NSData *voiceData = filePath.length ? [NSData dataWithContentsOfFile:filePath] : nil;
    BOOL silk = voiceData.length >= 6 && memcmp(voiceData.bytes, "#!SILK", 6) == 0;
    if (!silk) return ((id (*)(id, SEL))qjOriginalUploadRecordedFile)(self, command);

    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@/voice", qjVoiceBaseURL()]];
    if (!url) return ((id (*)(id, SEL))qjOriginalUploadRecordedFile)(self, command);
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"POST";
    request.timeoutInterval = 12;
    request.HTTPBody = voiceData;
    [request setValue:@"application/octet-stream" forHTTPHeaderField:@"Content-Type"];
    NSURLSessionDataTask *task = [NSURLSession.sharedSession dataTaskWithRequest:request
        completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            NSInteger status = [(NSHTTPURLResponse *)response statusCode];
            NSDictionary *json = data.length ? [NSJSONSerialization JSONObjectWithData:data options:0 error:nil] : nil;
            NSString *fileID = [json[@"id"] isKindOfClass:NSString.class] ? json[@"id"] : nil;
            BOOL ok = !error && status == 200 && [json[@"err_code"] integerValue] == 0 && [fileID hasPrefix:@"qjqp:"];
            if (ok) {
                qjNotifyUpload(fileID, filePath);
            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    ((id (*)(id, SEL))qjOriginalUploadRecordedFile)(self, command);
                });
            }
        }];
    [task resume];
    return @"ok";
}

static void qjInstallVoiceFix(void) {
    Class voiceClass = NSClassFromString(@"Voice");
    if (!voiceClass) return;
    Class metaClass = object_getClass(voiceClass);
    Method method = class_getClassMethod(voiceClass, NSSelectorFromString(@"downloadRecordedFile:"));
    if (method) {
        qjOriginalDownloadRecordedFile = method_getImplementation(method);
        class_replaceMethod(metaClass,
                           method_getName(method),
                           (IMP)qjDownloadRecordedFile,
                           method_getTypeEncoding(method));
    }
    Method uploadMethod = class_getClassMethod(voiceClass, NSSelectorFromString(@"uploadRecordedFile"));
    if (uploadMethod) {
        qjOriginalUploadRecordedFile = method_getImplementation(uploadMethod);
        class_replaceMethod(metaClass,
                           method_getName(uploadMethod),
                           (IMP)qjUploadRecordedFile,
                           method_getTypeEncoding(uploadMethod));
    }
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
