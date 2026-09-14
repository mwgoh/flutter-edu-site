## 이 레슨에서 할 일

ViewModel이 `notifyListeners()`로 변경을 알려도, 아직 그 알림을 **듣는 UI**가 없습니다. 이번 레슨에서는 `ListenableBuilder`로 ViewModel과 View를 연결해 MVVM을 완성합니다.

- `ListenableBuilder`로 UI를 자동으로 다시 빌드하기
- switch 식으로 가능한 모든 상태 처리하기
- 스타일을 갖춘 View 계층 완성하기

## 1. ArticleView 위젯 만들기

페이지 레이아웃과 ViewModel의 생명주기를 관리할 `StatefulWidget`을 만듭니다.

```dart
class ArticleView extends StatefulWidget {
  const ArticleView({super.key});

  @override
  State<ArticleView> createState() => _ArticleViewState();
}

class _ArticleViewState extends State<ArticleView> {
  // 다음 단계에서 ViewModel을 생성한다.

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Wikipedia Flutter')),
      body: const Center(child: Text('Loading...')),
    );
  }
}
```

## 2. ViewModel 생성과 해제

ViewModel을 `State`의 필드로 만들면 **다시 빌드되어도 같은 객체가 유지**됩니다. 첫 요청은 `initState()`에서 보내고, 화면이 사라질 때 `dispose()`에서 ViewModel도 해제합니다.

```dart
class _ArticleViewState extends State<ArticleView> {
  final ArticleViewModel viewModel = ArticleViewModel(ArticleModel());

  @override
  void initState() {
    super.initState();
    viewModel.fetchArticle();
  }

  @override
  void dispose() {
    viewModel.dispose(); // ChangeNotifier의 리스너 정리
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Wikipedia Flutter')),
      body: const Center(child: Text('Loading...')),
    );
  }
}
```

> **요청이 두 번 나가지 않게** 이전 레슨에서 `ArticleViewModel` 생성자 안에 `fetchArticle()` 호출을 넣었다면, 여기 `initState()`의 호출과 겹쳐 요청이 두 번 나갑니다. 둘 중 한 곳에서만 호출하세요. 이 레슨에서는 **생성자의 호출을 지우고** `initState()`에서 호출합니다.

## 3. MainApp 연결하기

```dart
class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: ArticleView());
  }
}
```

## 4. ListenableBuilder로 감싸기

`ListenableBuilder`는 `listenable`로 넘긴 객체(여기서는 ViewModel)를 듣다가, `notifyListeners()`가 호출되면 **`builder`를 다시 실행**합니다.

```dart
body: ListenableBuilder(
  listenable: viewModel,
  builder: (context, child) {
    return const Center(child: Text('Loading...'));
  },
),
```

`child` 위젯 하나를 받는 대신 **builder 콜백**을 쓰기 때문에, 상태에 따라 완전히 다른 위젯을 반환하는 조건부 렌더링이 자연스럽습니다.

## 5. switch 식으로 모든 상태 처리하기

ViewModel의 세 속성(`isLoading`, `summary`, `error`)을 **레코드로 묶어** switch 식에 넘기면 상태 조합을 한눈에 처리할 수 있습니다.

```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('Wikipedia Flutter')),
    body: Center(
      child: ListenableBuilder(
        listenable: viewModel,
        builder: (context, _) {
          return switch ((
            viewModel.isLoading,
            viewModel.summary,
            viewModel.error,
          )) {
            (true, _, _) => const CircularProgressIndicator(),
            (_, _, final Exception e) => Text('Error: $e'),
            (_, final summary?, _) => ArticlePage(
              summary: summary,
              nextArticleCallback: viewModel.fetchArticle,
            ),
            _ => const Text('Something went wrong!'),
          };
        },
      ),
    ),
  );
}
```

| 패턴 | 상태 | 표시 |
| --- | --- | --- |
| `(true, _, _)` | 로딩 중 | 원형 로딩 표시기 |
| `(_, _, final Exception e)` | 오류 발생 | 오류 메시지 |
| `(_, final summary?, _)` | 데이터 있음 | 문서 페이지 |
| `_` | 예상하지 못한 상태 | 대체 문구 |

`final summary?`는 **null 검사 패턴**입니다. 값이 null이 아닐 때만 매칭되고, 매칭되면 `summary`는 non-null 타입(`Summary`)으로 바인딩됩니다.

## 6. ArticlePage: 스크롤과 버튼

문서 내용과 "다음 문서" 버튼을 담는 위젯입니다. 내용이 화면보다 길 수 있으므로 `SingleChildScrollView`로 감쌉니다.

```dart
class ArticlePage extends StatelessWidget {
  const ArticlePage({
    super.key,
    required this.summary,
    required this.nextArticleCallback,
  });

  final Summary summary;
  final VoidCallback nextArticleCallback;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          ArticleWidget(summary: summary),
          ElevatedButton(
            onPressed: nextArticleCallback,
            child: const Text('Next random article'),
          ),
        ],
      ),
    );
  }
}
```

`VoidCallback`은 `void Function()`의 별칭입니다. 버튼을 누르면 ViewModel의 `fetchArticle`이 호출되어 새 문서를 불러옵니다.

## 7. ArticleWidget: 문서 내용 표시

```dart
class ArticleWidget extends StatelessWidget {
  const ArticleWidget({super.key, required this.summary});

  final Summary summary;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        spacing: 10,
        children: [
          if (summary.hasImage) Image.network(summary.originalImage!.source),
          Text(
            summary.titles.normalized,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.displaySmall,
          ),
          if (summary.description != null)
            Text(
              summary.description!,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          Text(summary.extract),
        ],
      ),
    );
  }
}
```

- **컬렉션 if**: 이미지와 설명은 있을 때만 표시합니다.
- **테마 텍스트 스타일**: `displaySmall`, `bodySmall`로 시각적 위계를 만듭니다.
- **`TextOverflow.ellipsis`**: 긴 제목이 레이아웃을 깨지 않도록 말줄임표로 자릅니다.

## 8. 실행 흐름 정리

1. 앱이 `ArticleView`를 만들고 `State`가 ViewModel을 생성합니다.
2. `initState()`에서 `fetchArticle()`을 호출합니다.
3. ViewModel이 `isLoading = true` 후 `notifyListeners()`를 호출합니다.
4. `ListenableBuilder`가 알림을 받고 로딩 표시기를 그립니다.
5. 응답이 오면 `summary`(또는 `error`)를 채우고 다시 `notifyListeners()`를 호출합니다.
6. switch 식이 새 상태에 맞는 UI(문서 또는 오류)를 반환합니다.
7. **Next random article** 버튼을 누르면 3번부터 반복합니다.

## 핵심 정리

- `ListenableBuilder`는 ViewModel의 `notifyListeners()`에 반응해 UI를 **자동으로 다시 빌드**합니다.
- 레코드와 switch 식으로 로딩·오류·성공 상태를 빠짐없이 처리했습니다.
- 비즈니스 로직(ViewModel)과 렌더링(View)이 분리된 **MVVM 구조**를 완성했습니다. 이 패턴은 테스트하기 쉽고 큰 앱으로도 확장됩니다.
