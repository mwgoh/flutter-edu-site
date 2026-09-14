## 만들 앱: Wikipedia 리더

이번 과정에서는 [Wikipedia API](https://en.wikipedia.org/api/rest_v1/)에서 **무작위 문서 요약**을 받아 보여 주는 앱을 만듭니다. 화면에는 문서의 이미지, 제목, 설명, 본문 요약이 표시되고, 버튼을 누르면 다음 문서를 불러옵니다.

이 앱을 만들며 배울 개념은 다음과 같습니다.

- Flutter에서 **HTTP 요청** 보내기
- `ChangeNotifier`로 **앱 상태 관리**하기
- **MVVM** 아키텍처 패턴 적용하기
- 데이터가 바뀌면 **자동으로 갱신되는 UI** 만들기

> **사전 지식** Dart 기초와 앞 과정(Flutter UI 입문)을 마쳤다고 가정합니다.

## 1. 새 프로젝트 만들기

```bash
flutter create wikipedia_reader --empty
```

`--empty`는 기본 카운터 예제 없이 최소한의 코드로 프로젝트를 만듭니다.

## 2. http 패키지 추가하기

```bash
cd wikipedia_reader
flutter pub add http
```

`flutter pub add`는 `pubspec.yaml`의 `dependencies`에 패키지를 추가하고 바로 내려받습니다.

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.0.0 # 실행 시점의 최신 버전이 자동으로 기록된다
```

**패키지**를 사용하면 커뮤니티가 이미 만든 코드를 가져다 쓸 수 있습니다. Flutter·Dart 패키지는 [pub.dev](https://pub.dev)에서 검색할 수 있습니다.

## 3. 데이터 모델 만들기: lib/summary.dart

Wikipedia API가 돌려주는 JSON을 Dart 객체로 표현할 `Summary` 클래스를 만듭니다. [공식 튜토리얼 페이지](https://docs.flutter.dev/learn/pathway/tutorial/set-up-state-project)의 전체 코드를 `lib/summary.dart`에 복사하세요. 핵심 구조는 다음과 같습니다.

```dart
/// Wikipedia API가 반환하는 JSON 데이터의 표현
class Summary {
  Summary({
    required this.titles,
    required this.pageId,
    required this.extract,
    required this.extractHtml,
    required this.lang,
    required this.dir,
    required this.url,
    this.description,
    this.thumbnail,
    this.originalImage,
  });

  final TitlesSet titles;       // 제목 정보
  final int pageId;             // 문서 ID
  final String extract;         // 본문 앞부분(일반 텍스트)
  final String extractHtml;     // 본문 앞부분(HTML)
  final String lang;            // 언어 코드(예: en)
  final String dir;             // 텍스트 방향(ltr, rtl)
  final String url;             // 문서 URL
  final String? description;    // 설명(없을 수 있음)
  final ImageFile? thumbnail;   // 썸네일(없을 수 있음)
  final ImageFile? originalImage; // 원본 이미지(없을 수 있음)

  /// 이미지가 있는 문서인지
  bool get hasImage => originalImage != null && thumbnail != null;

  /// JSON 맵에서 Summary를 만든다
  static Summary fromJson(Map<String, Object?> json) {
    return switch (json) {
      {
        'titles': final Map<String, Object?> titles,
        'pageid': final int pageId,
        'extract': final String extract,
        'extract_html': final String extractHtml,
        'thumbnail': final Map<String, Object?> thumbnail,
        'originalimage': final Map<String, Object?> originalImage,
        'lang': final String lang,
        'dir': final String dir,
        'description': final String description,
        'content_urls': {
          'desktop': {'page': final String url},
          'mobile': {'page': String _},
        },
      } =>
        Summary(
          titles: TitlesSet.fromJson(titles),
          pageId: pageId,
          extract: extract,
          extractHtml: extractHtml,
          thumbnail: ImageFile.fromJson(thumbnail),
          originalImage: ImageFile.fromJson(originalImage),
          lang: lang,
          dir: dir,
          description: description,
          url: url,
        ),
      // ... 이미지나 설명이 없는 경우를 처리하는 패턴이 이어진다
      _ => throw FormatException('Could not deserialize Summary, json=$json'),
    };
  }
}
```

`fromJson`은 Dart 3의 **패턴 매칭**을 사용합니다. 맵 패턴 `{'pageid': final int pageId, ...}`은 다음 두 가지를 동시에 합니다.

1. JSON에 해당 키가 있고 값의 타입이 맞는지 **검사**
2. 맞으면 값을 `pageId` 같은 변수에 **바인딩**

어떤 패턴과도 맞지 않으면 마지막 `_` 분기에서 `FormatException`을 던집니다. 같은 파일에는 이미지 정보를 담는 `ImageFile`, 제목 정보를 담는 `TitlesSet` 클래스도 같은 방식으로 정의되어 있습니다.

## 4. main.dart 준비하기

`lib/main.dart`를 다음 코드로 바꿉니다.

```dart
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart';

import 'summary.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Wikipedia Flutter')),
        body: const Center(child: Text('Loading...')),
      ),
    );
  }
}
```

| import | 용도 |
| --- | --- |
| `dart:convert` | JSON 파싱(`jsonDecode`) |
| `dart:io` | `HttpException` 등 I/O 관련 클래스 |
| `package:http/http.dart` | HTTP 요청(`get`) |
| `summary.dart` | Wikipedia 데이터 모델 |

## 5. 실행하기

```bash
flutter run -d chrome
```

앱 바에 "Wikipedia Flutter", 가운데에 "Loading..."이 보이면 준비 완료입니다.

> **Android·macOS에서 실행한다면** 네트워크 권한이 필요합니다. Android는 `android/app/src/main/AndroidManifest.xml`에 `<uses-permission android:name="android.permission.INTERNET" />`를, macOS는 `macos/Runner/DebugProfile.entitlements`와 `Release.entitlements`에 `com.apple.security.network.client` 키를 `true`로 추가하세요.

## 핵심 정리

- Wikipedia 리더 앱으로 HTTP 요청, `ChangeNotifier`, MVVM을 배울 준비를 했습니다.
- `flutter pub add http`로 패키지를 추가했습니다.
- 패턴 매칭으로 JSON을 안전하게 파싱하는 `Summary` 데이터 모델을 만들었습니다.
- HTTP 요청과 JSON 파싱에 필요한 import를 갖춘 기본 앱 구조를 준비했습니다.
