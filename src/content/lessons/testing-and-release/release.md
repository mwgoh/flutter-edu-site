## 이 레슨에서 할 일

앱을 완성했다면 이제 사용자에게 전달할 차례입니다. 이번 레슨에서는 **빌드 모드**와 **버전 관리**를 이해하고, **Android**와 **웹** 릴리스 과정을 따라가 봅니다.

## 1. 세 가지 빌드 모드

| 모드 | 용도 | 특징 |
| --- | --- | --- |
| **debug** | 개발 중 | 핫 리로드 지원, assert 활성화, 디버깅 도구 연결. 앱이 느리고 크기가 큼 |
| **profile** | 성능 분석 | 릴리스에 가깝게 최적화하되 성능 추적 기능 유지. 에뮬레이터·시뮬레이터에서는 실행 불가 |
| **release** | 배포 | AOT 컴파일로 최적화, 디버깅 기능 제거. 가장 빠르고 작음 |

```bash
flutter run --release   # 기기에서 릴리스 모드로 실행해 보기
flutter run --profile   # 성능 측정
```

> **성능은 profile·release 모드에서 측정하세요** debug 모드는 개발 편의를 위해 느리게 동작하므로, 여기서 느리다고 실제 앱이 느린 것은 아닙니다.

## 2. 버전 관리: pubspec.yaml

```yaml
version: 1.0.0+1
```

- `1.0.0`: 사용자에게 보이는 **버전 이름**(Android versionName, iOS CFBundleShortVersionString)
- `+1`: 스토어가 구분하는 **빌드 번호**(Android versionCode, iOS CFBundleVersion). 업로드할 때마다 늘려야 합니다.

## 3. Android 릴리스

### 3-1. 런처 아이콘

[Android 적응형 아이콘 가이드](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)를 참고해 아이콘을 만들고 `android/app/src/main/res/`의 `mipmap-` 폴더들에 넣습니다. `AndroidManifest.xml`의 `<application android:icon="@mipmap/ic_launcher" ...>`가 이를 가리킵니다.

### 3-2. 업로드 키스토어 만들기

Google Play에 올리는 앱은 **디지털 서명**이 필요합니다. 먼저 업로드 키를 만듭니다.

macOS·Linux:

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA \
        -storetype JKS -keysize 2048 -validity 10000 -alias upload
```

Windows PowerShell:

```bash
keytool -genkey -v -keystore $env:USERPROFILE\upload-keystore.jks `
        -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 `
        -alias upload
```

### 3-3. key.properties 만들기

`android/key.properties` 파일에 키 정보를 적습니다.

```ini
storePassword=<앞 단계에서 입력한 비밀번호>
keyPassword=<앞 단계에서 입력한 비밀번호>
keyAlias=upload
storeFile=<키스토어 파일 경로>
```

> **보안 주의** `key.properties`와 키스토어 파일은 **절대 Git에 커밋하지 마세요.** `.gitignore`에 추가하고 안전한 곳에 백업합니다. 업로드 키를 잃어버리거나 유출되면 앱 업데이트에 문제가 생깁니다.

### 3-4. Gradle에서 서명 설정

`android/app/build.gradle.kts`에서 `key.properties`를 읽어 릴리스 빌드에 서명을 적용합니다.

```kotlin
import java.util.Properties
import java.io.FileInputStream

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    // ...
    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties.getProperty("keyAlias")
            keyPassword = keystoreProperties.getProperty("keyPassword")
            storeFile = keystoreProperties.getProperty("storeFile")?.let { file(it) }
            storePassword = keystoreProperties.getProperty("storePassword")
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

Gradle 설정을 바꾼 뒤에는 `flutter clean`을 실행해 캐시된 빌드를 지웁니다.

### 3-5. 매니페스트와 빌드 설정 점검

- `AndroidManifest.xml`: `android:label`(앱 이름)과 필요한 권한을 확인합니다. 인터넷을 쓰는 앱은 `<uses-permission android:name="android.permission.INTERNET"/>`가 필요합니다.
- `build.gradle.kts`: **applicationId**(역도메인 형식의 고유 ID, 예: `com.example.birdle`)와 `minSdk`·`targetSdk`·`compileSdk`를 확인합니다. 버전 코드와 이름은 `pubspec.yaml`에서 자동으로 가져옵니다.

### 3-6. 릴리스 빌드

Google Play는 **앱 번들(.aab)**을 권장합니다.

```bash
flutter build appbundle
```

결과물: `build/app/outputs/bundle/release/app.aab`

스토어 밖에서 배포할 APK가 필요하면 ABI별로 나눠 빌드합니다.

```bash
flutter build apk --split-per-abi
```

결과물: `build/app/outputs/flutter-apk/` 아래 `app-armeabi-v7a-release.apk`, `app-arm64-v8a-release.apk`, `app-x86_64-release.apk`

> **코드 난독화(선택)** 리버스 엔지니어링을 어렵게 하려면 `flutter build appbundle --obfuscate --split-debug-info=<심볼 저장 폴더>`로 빌드합니다. 오류 스택을 해독하려면 저장된 심볼 파일을 보관해야 합니다.

### 3-7. 테스트와 게시

1. `bundletool`로 번들에서 APK를 만들어 기기에 설치하거나, Play Console의 **내부 테스트 트랙**에 올려 검증합니다.
2. [Google Play 게시 문서](https://developer.android.com/distribute)를 따라 앱 번들을 업로드합니다.

## 4. 웹 릴리스

### 4-1. 빌드

```bash
flutter build web
```

결과물은 `build/web` 폴더에 생성되며, 이 폴더를 그대로 웹 서버에 올리면 됩니다.

| 빌드 | 명령 | 최소화 | 트리 셰이킹 |
| --- | --- | --- | --- |
| debug | `flutter build web --debug` | 아니요 | 아니요 |
| profile | `flutter build web --profile` | 아니요 | 예 |
| release | `flutter build web` | 예 | 예 |

### 4-2. WebAssembly 빌드

```bash
flutter build web --wasm
```

WebAssembly 빌드를 제공하려면 웹 서버가 다음 HTTP 헤더를 보내야 합니다.

```text
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
```

### 4-3. 하위 경로에 배포할 때

GitHub Pages처럼 `https://사용자.github.io/저장소명/` 같은 하위 경로에 올린다면 기준 경로를 지정합니다.

```bash
flutter build web --base-href /저장소명/
```

### 4-4. 소스 맵

```bash
flutter build web --source-maps
```

오류 추적용 `.js.map`·`.wasm.map` 파일을 만듭니다. **공개 호스팅에는 올리지 말고** 비공개 오류 모니터링 서비스에만 업로드하세요.

### 4-5. Firebase Hosting에 배포

```bash
npm install -g firebase-tools
firebase experiments:enable webframeworks
firebase init hosting
firebase deploy
```

`firebase deploy`가 `flutter build web --release`를 자동으로 실행한 뒤 배포합니다. GitHub Pages, Google Cloud 같은 다른 정적 호스팅도 사용할 수 있습니다.

## 5. 그 밖의 플랫폼

- **iOS**: macOS와 Xcode, Apple Developer Program 가입이 필요합니다. `flutter build ipa`로 빌드한 뒤 App Store Connect에 업로드합니다. [iOS 배포 문서](https://docs.flutter.dev/deployment/ios)
- **데스크톱**: [macOS](https://docs.flutter.dev/deployment/macos), [Windows](https://docs.flutter.dev/deployment/windows), [Linux](https://docs.flutter.dev/deployment/linux) 배포 문서를 참고하세요.
- **자동 배포**: fastlane 등을 이용한 [지속적 배포(CD)](https://docs.flutter.dev/deployment/cd)를 구성하면 빌드와 업로드를 자동화할 수 있습니다.

## 핵심 정리

- 개발은 **debug**, 성능 측정은 **profile**, 배포는 **release** 모드를 사용합니다.
- `pubspec.yaml`의 `version: 이름+빌드번호`로 버전을 관리합니다.
- Android는 업로드 키로 서명한 뒤 `flutter build appbundle`로 `.aab`를 만들어 Google Play에 올리며, 키 파일은 비공개로 관리합니다.
- 웹은 `flutter build web`의 결과물 `build/web`을 호스팅에 올리고, 필요하면 `--wasm`, `--base-href`를 사용합니다.
