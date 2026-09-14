## 이 레슨에서 할 일

**상태 관리**란 앱이 데이터를 바꾸고, 새 데이터로 UI를 다시 그리라고 Flutter에 알리는 방법입니다. 이번 레슨에서는 MVVM의 **ViewModel** 계층을 `ChangeNotifier`로 만듭니다.

- `ChangeNotifier`를 상속한 `ArticleViewModel` 만들기
- 로딩·성공·오류 상태 관리하기
- `notifyListeners()`로 UI에 변경 알리기

## 1. ChangeNotifier란?

`ChangeNotifier`는 Flutter가 제공하는 클래스로, **데이터가 바뀌었을 때 등록된 리스너에게 알리는** 기능을 가집니다. 이 클래스를 상속하면 `notifyListeners()` 메서드를 쓸 수 있고, 이를 호출하면 듣고 있던 위젯이 다시 빌드됩니다.

## 2. ViewModel 기본 구조

```dart
class ArticleViewModel extends ChangeNotifier {
  final ArticleModel model;
  Summary? summary;
  Exception? error;
  bool isLoading = false;

  ArticleViewModel(this.model);
}
```

| 상태 속성 | 의미 |
| --- | --- |
| `summary` | 현재 표시할 Wikipedia 문서 데이터 |
| `error` | 데이터를 가져오다 발생한 오류 |
| `isLoading` | 로딩 표시기를 보여 줄지 여부 |

## 3. 생성할 때 데이터 불러오기

ViewModel이 만들어지면 곧바로 문서를 불러오도록 생성자에서 `fetchArticle()`을 호출합니다. **생성자는 `async`일 수 없으므로** 비동기 작업은 별도 메서드로 분리합니다.

```dart
class ArticleViewModel extends ChangeNotifier {
  final ArticleModel model;
  Summary? summary;
  Exception? error;
  bool isLoading = false;

  ArticleViewModel(this.model) {
    fetchArticle();
  }

  // 다음 단계에서 구현한다.
  Future<void> fetchArticle() async {}
}
```

## 4. 로딩 상태 알리기

요청을 시작할 때와 끝날 때 `isLoading`을 바꾸고 `notifyListeners()`를 호출합니다. 그러면 UI가 요청 중에는 로딩 표시기를, 끝나면 결과를 보여 줄 수 있습니다.

```dart
Future<void> fetchArticle() async {
  isLoading = true;
  notifyListeners();

  // TODO: 데이터 가져오기

  isLoading = false;
  notifyListeners();
}
```

## 5. Model에서 문서 가져오기

`try`/`catch`로 네트워크 오류를 처리합니다.

```dart
class ArticleViewModel extends ChangeNotifier {
  final ArticleModel model;
  Summary? summary;
  Exception? error;
  bool isLoading = false;

  ArticleViewModel(this.model) {
    fetchArticle();
  }

  Future<void> fetchArticle() async {
    isLoading = true;
    notifyListeners();
    try {
      summary = await model.getRandomArticleSummary();
      error = null; // 이전 오류를 지운다.
    } on HttpException catch (e) {
      error = e;
      summary = null;
    }
    isLoading = false;
    notifyListeners();
  }
}
```

- **성공하면** 이전 오류를 지웁니다.
- **실패하면** 이전 문서를 지웁니다.

이렇게 하면 `summary`와 `error`가 동시에 값을 갖는 **모순된 상태**를 막을 수 있습니다.

> **더 견고하게** 위 코드는 `HttpException`만 잡습니다. 인터넷 연결이 끊기거나 JSON 형식이 달라 다른 예외가 나면 `isLoading`이 `true`로 남을 수 있습니다. 실무에서는 `on Exception catch (e)`로 범위를 넓히거나 `finally` 블록에서 `isLoading = false`를 처리하는 것을 고려하세요.

## 6. ViewModel 테스트해 보기

UI를 연결하기 전에 콘솔 출력으로 동작을 확인합니다.

```dart
Future<void> fetchArticle() async {
  isLoading = true;
  notifyListeners();
  try {
    summary = await model.getRandomArticleSummary();
    print('Article loaded: ${summary!.titles.normalized}'); // 임시 출력
    error = null;
  } on HttpException catch (e) {
    print('Error loading article: ${e.message}'); // 임시 출력
    error = e;
    summary = null;
  }
  isLoading = false;
  notifyListeners();
}
```

`MainApp`에서 ViewModel을 임시로 만들어 봅니다.

```dart
class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    // HTTP 요청을 확인하기 위해 ArticleViewModel을 임시로 생성한다.
    final viewModel = ArticleViewModel(ArticleModel());

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Wikipedia Flutter')),
        body: const Center(child: Text('Check console for article data')),
      ),
    );
  }
}
```

핫 리로드한 뒤 콘솔에 문서 제목이나 오류 메시지가 출력되는지 확인하세요.

> **주의** `build` 안에서 ViewModel을 만들면 다시 빌드될 때마다 새 객체와 새 요청이 생깁니다. 확인용 임시 코드이며, 다음 레슨에서 `State` 안으로 옮깁니다.

## 핵심 정리

- `ChangeNotifier`를 상속한 **ViewModel**이 UI와 Model 사이에서 상태를 관리합니다.
- `isLoading`, `summary`, `error`로 로딩·성공·오류 상태를 표현하고 `try`/`catch`로 오류를 처리했습니다.
- 상태를 바꾼 뒤 `notifyListeners()`를 호출해 리스너에게 다시 빌드하라고 알립니다.
