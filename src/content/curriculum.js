// 교육 과정 메타데이터
// docs.flutter.dev 의 Learn 경로(https://docs.flutter.dev/learn/pathway)를 뼈대로,
// Get started · Testing · Deployment 가이드를 더해 구성했다.
// 퀴즈의 answer(정답 인덱스)와 explanation은 서버에서 채점할 때만 사용하며 클라이언트로 보내지 않는다.

const DOCS = 'https://docs.flutter.dev';

export const courses = [
  {
    id: 'getting-started',
    title: 'Flutter 시작하기',
    subtitle: '개발 환경 설치부터 첫 앱 실행까지',
    description:
      'VS Code와 Flutter SDK를 설치하고, Flutter 코드를 읽는 데 필요한 Dart 문법을 익힌 뒤 첫 앱을 만들어 핫 리로드까지 체험합니다.',
    level: '입문',
    project: null,
    sourceUrl: `${DOCS}/learn/pathway`,
    lessons: [
      {
        id: 'install',
        title: '개발 환경 설치하기',
        summary: 'VS Code의 Flutter 확장으로 SDK를 설치하고 flutter doctor로 점검합니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/install/quick`,
        goals: [
          'Flutter 개발에 필요한 Git과 VS Code를 준비한다',
          'VS Code Flutter 확장으로 Flutter SDK를 내려받고 PATH에 추가한다',
          'flutter doctor로 설치 상태를 점검하고 Chrome에서 앱을 실행한다',
        ],
        quiz: [
          {
            question: 'Flutter 설치 후 개발 환경이 올바르게 구성되었는지 점검하는 명령어는?',
            options: ['flutter doctor', 'flutter check', 'flutter verify', 'dart setup'],
            answer: 0,
            explanation:
              'flutter doctor는 SDK 설치 상태와 플랫폼별 도구(Android 툴체인, Xcode, Chrome 등)의 준비 여부를 점검합니다.',
          },
          {
            question: 'VS Code에서 "Add SDK to PATH"를 누른 직후 해야 할 일은?',
            options: [
              '열려 있는 모든 터미널을 닫았다 다시 열고 VS Code를 재시작한다',
              '컴퓨터를 초기화한다',
              'Android Studio를 반드시 먼저 설치한다',
              'pubspec.yaml 파일을 삭제한다',
            ],
            answer: 0,
            explanation: '변경된 PATH가 반영되도록 모든 터미널 창과 VS Code를 다시 시작해야 flutter 명령을 찾을 수 있습니다.',
          },
          {
            question: '웹(Chrome)만 대상으로 개발할 때 flutter doctor의 Android Studio 관련 경고는?',
            options: ['무시해도 된다', '반드시 해결해야 앱이 실행된다', 'Flutter SDK를 재설치해야 한다', 'Chrome을 제거해야 한다'],
            answer: 0,
            explanation: '공식 문서에 따르면 Android를 대상으로 하지 않는다면 Android Studio 관련 경고는 무시해도 됩니다.',
          },
        ],
      },
      {
        id: 'dart-basics',
        title: 'Flutter를 위한 Dart 핵심 문법',
        summary: '변수, null safety, 클래스, 레코드, switch 식, async/await 등 튜토리얼에 나오는 문법을 정리합니다.',
        minutes: 40,
        sourceUrl: 'https://dart.dev/language',
        goals: [
          'var · final · const의 차이와 null safety를 이해한다',
          '이름 있는 매개변수와 생성자, 클래스를 읽고 쓸 수 있다',
          '레코드, switch 식, 컬렉션 for/if, async/await를 익힌다',
        ],
        quiz: [
          {
            question: '컴파일 타임 상수를 선언할 때 사용하는 키워드는?',
            options: ['const', 'final', 'var', 'late'],
            answer: 0,
            explanation:
              'const는 컴파일 타임 상수, final은 한 번만 대입할 수 있는 런타임 값입니다. Flutter에서 const 위젯은 불필요한 재생성을 줄여 줍니다.',
          },
          {
            question: '`String? name;` 에서 `?`의 의미는?',
            options: ['name에 null이 들어갈 수 있다', 'name은 선택 매개변수이다', 'name은 private 필드이다', 'name은 비동기 값이다'],
            answer: 0,
            explanation: '타입 뒤의 `?`는 nullable 타입을 뜻합니다. `?`가 없는 타입에는 null을 대입할 수 없습니다(sound null safety).',
          },
          {
            question: '`await` 키워드를 사용할 수 있는 곳은?',
            options: ['async로 표시한 함수 안', '모든 함수 안', '클래스 필드 선언부', 'const 생성자 안'],
            answer: 0,
            explanation: 'await는 async 함수 안에서만 쓸 수 있으며, Future가 완료될 때까지 기다린 뒤 결과 값을 돌려줍니다.',
          },
        ],
      },
      {
        id: 'create-an-app',
        title: '첫 번째 Flutter 앱 만들기',
        summary: 'flutter create로 프로젝트를 만들고 위젯 트리 구조와 핫 리로드를 체험합니다.',
        minutes: 25,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/create-an-app`,
        goals: [
          'CLI로 새 Flutter 프로젝트를 만든다',
          '위젯과 위젯 트리의 개념을 이해한다',
          '앱을 실행하고 핫 리로드를 사용한다',
        ],
        quiz: [
          {
            question: '`runApp()` 함수의 역할은?',
            options: [
              '전달받은 위젯을 위젯 트리의 루트로 만든다',
              '앱을 스토어에 배포한다',
              'pub.dev에서 패키지를 설치한다',
              '단위 테스트를 실행한다',
            ],
            answer: 0,
            explanation: 'runApp()은 위젯 하나를 받아 앱 위젯 트리의 루트로 붙이고 화면에 그리기 시작합니다.',
          },
          {
            question: '`flutter run`이 실행 중인 터미널에서 핫 리로드를 실행하는 키는?',
            options: ['r', 'R', 'q', 'd'],
            answer: 0,
            explanation: '소문자 r은 상태를 유지하는 핫 리로드, 대문자 R은 상태를 초기화하는 핫 리스타트, q는 종료입니다.',
          },
          {
            question: '빈 템플릿(`--empty`)의 위젯 트리에서 `Text(\'Hello World!\')`의 바로 위 부모 위젯은?',
            options: ['Center', 'Scaffold', 'MaterialApp', 'MainApp'],
            answer: 0,
            explanation: '트리는 MainApp → MaterialApp → Scaffold → Center → Text 순서이므로 Text의 부모는 Center입니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'flutter-ui-intro',
    title: 'Flutter UI 입문',
    subtitle: 'Wordle 스타일 게임 Birdle로 배우는 위젯의 기본',
    description:
      '커스텀 위젯, 레이아웃, 사용자 입력, 상태, 애니메이션을 차례로 적용하며 단어 맞히기 게임 Birdle을 완성합니다.',
    level: '초급',
    project: 'Birdle',
    sourceUrl: `${DOCS}/learn/pathway/tutorial`,
    lessons: [
      {
        id: 'widget-fundamentals',
        title: '위젯 만들기',
        summary: 'StatelessWidget으로 재사용 가능한 Tile 위젯을 만들고 Container와 BoxDecoration으로 꾸밉니다.',
        minutes: 35,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/widget-fundamentals`,
        goals: [
          '커스텀 StatelessWidget을 만든다',
          '생성자 매개변수로 위젯을 재사용 가능하게 만든다',
          'Container와 BoxDecoration으로 위젯을 꾸민다',
        ],
        quiz: [
          {
            question: 'Flutter 위젯의 `build` 메서드가 반환해야 하는 것은?',
            options: ['또 다른 위젯', 'String', 'void', 'BuildContext'],
            answer: 0,
            explanation: 'build 메서드는 항상 위젯을 반환하며, 반환된 위젯이 위젯 트리의 일부가 됩니다.',
          },
          {
            question: 'Container에 테두리, 배경색, 그림자 같은 장식을 추가할 때 사용하는 객체는?',
            options: ['BoxDecoration', 'TextStyle', 'EdgeInsets', 'ThemeData'],
            answer: 0,
            explanation: 'BoxDecoration은 테두리, 배경색, 그라데이션, 그림자 등을 Container에 적용합니다.',
          },
          {
            question: 'Tile 위젯에서 `hitType` 값에 따라 배경색을 고르는 데 사용한 Dart 문법은?',
            options: ['switch 식(switch expression)', 'try-catch', 'extension 메서드', 'late 변수'],
            answer: 0,
            explanation: '`color: switch (hitType) { HitType.hit => Colors.green, ... }`처럼 switch 식은 값을 바로 반환합니다.',
          },
        ],
      },
      {
        id: 'layout',
        title: '레이아웃 위젯 배치하기',
        summary: 'Scaffold · AppBar로 화면 구조를 잡고 Column · Row로 5×5 게임 보드를 만듭니다.',
        minutes: 35,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/layout`,
        goals: [
          'Scaffold와 AppBar로 앱 화면 구조를 만든다',
          'Column과 Row로 위젯을 배치한다',
          '컬렉션 for로 데이터에서 위젯을 동적으로 생성한다',
        ],
        quiz: [
          {
            question: 'Column과 Row 위젯의 가장 중요한 차이는?',
            options: [
              'Column은 자식을 세로로, Row는 가로로 배치한다',
              'Column은 스크롤용, Row는 정적 콘텐츠용이다',
              'Column은 자식 수 제한이 없고 Row는 두 개까지만 가능하다',
              'Column은 Scaffold 안에서만 쓸 수 있다',
            ],
            answer: 0,
            explanation: 'Column은 세로(수직) 방향, Row는 가로(수평) 방향으로 자식을 배치합니다.',
          },
          {
            question: 'Scaffold 위젯이 제공하는 것은?',
            options: [
              '앱 바, body, drawer 등의 슬롯을 가진 Material 스타일 페이지 레이아웃',
              '페이지 배경색만',
              '페이지 간 이동 기능',
              '페이지 상태 자동 관리',
            ],
            answer: 0,
            explanation: 'Scaffold는 appBar, body, drawer, floatingActionButton 같은 슬롯이 있는 Material 페이지 뼈대입니다.',
          },
          {
            question: 'Column이나 Row의 자식 사이에 일정한 간격을 넣는 속성은?',
            options: ['spacing', 'margin', 'gap', 'divider'],
            answer: 0,
            explanation: '`spacing: 5.0`은 주축(main axis) 방향으로 자식 사이에 5픽셀 간격을 넣습니다.',
          },
        ],
      },
      {
        id: 'devtools',
        title: 'DevTools로 앱 살펴보기',
        summary: '위젯 인스펙터와 속성 편집기로 위젯 트리를 탐색하고 레이아웃 문제를 디버깅합니다.',
        minutes: 25,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/devtools`,
        goals: [
          '위젯 인스펙터로 앱의 위젯 트리를 탐색한다',
          'unbounded constraints 같은 레이아웃 오류를 이해한다',
          '속성 편집기로 속성 값을 실시간으로 바꿔 본다',
        ],
        quiz: [
          {
            question: '"unbounded constraints" 오류의 흔한 원인은?',
            options: [
              '무한히 커지려는 위젯을 스크롤 가능 영역이나 flex 컨테이너 안에 제약 없이 넣는 것',
              'StatefulWidget을 너무 많이 사용하는 것',
              '데이터 변경 후 setState를 호출하지 않는 것',
              'Container에 color를 지정하지 않는 것',
            ],
            answer: 0,
            explanation: 'Row 안의 ListView나 중첩된 스크롤 뷰처럼 무한한 제약을 받은 위젯이 최대한 커지려 하면 오류가 납니다.',
          },
          {
            question: 'Flutter DevTools의 위젯 인스펙터로 할 수 있는 일은?',
            options: [
              '위젯 트리를 시각화하고, 위젯 속성을 확인하고, 소스 코드로 이동한다',
              '위젯 단위 테스트를 자동 생성한다',
              '앱을 스토어에 바로 배포한다',
              '앱 테마 색상을 코드 없이 영구 변경한다',
            ],
            answer: 0,
            explanation: '위젯 인스펙터는 앱 구조를 탐색하고 속성을 살펴보며 해당 소스 코드 위치로 이동하는 디버깅 도구입니다.',
          },
        ],
      },
      {
        id: 'user-input',
        title: '사용자 입력 처리하기',
        summary: 'TextField, TextEditingController, FocusNode, IconButton으로 추측 입력 위젯을 만듭니다.',
        minutes: 40,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/user-input`,
        goals: [
          'TextField로 텍스트 입력 위젯을 만든다',
          'TextEditingController로 입력 값을 읽고 지운다',
          'FocusNode로 포커스를 제어하고 콜백으로 사용자 동작을 처리한다',
        ],
        quiz: [
          {
            question: 'TextField의 텍스트를 코드에서 읽거나 지우려면?',
            options: [
              'TextField에 연결한 TextEditingController를 사용한다',
              'TextField를 다시 생성한다',
              'BuildContext에서 텍스트를 읽는다',
              'setState 안에서 TextField.value를 바꾼다',
            ],
            answer: 0,
            explanation: 'TextEditingController의 `text` 속성으로 값을 읽고 `clear()`로 지웁니다.',
          },
          {
            question: '특정 TextField로 포커스를 옮기려면?',
            options: ['FocusNode의 requestFocus()를 호출한다', 'autofocus를 매번 true로 바꾼다', 'TextField를 Expanded로 감싼다', 'Navigator.push를 호출한다'],
            answer: 0,
            explanation: 'FocusNode를 TextField에 연결하고 requestFocus()를 호출하면 해당 필드로 포커스가 이동합니다.',
          },
          {
            question: 'Row 안의 TextField가 남은 가로 공간을 모두 채우게 하려면 무엇으로 감싸나요?',
            options: ['Expanded', 'Center', 'Opacity', 'Align'],
            answer: 0,
            explanation: 'Expanded는 Row/Column의 남은 공간을 채우며, TextField의 unbounded width 오류도 해결합니다.',
          },
        ],
      },
      {
        id: 'stateful-widget',
        title: 'StatefulWidget과 setState',
        summary: 'GamePage와 GuessInput을 StatefulWidget으로 바꾸고 setState로 화면을 갱신합니다.',
        minutes: 35,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/stateful-widget`,
        goals: [
          '위젯이 상태를 가져야 하는 경우를 판단한다',
          'StatelessWidget을 StatefulWidget으로 변환한다',
          'setState로 UI 갱신을 트리거한다',
        ],
        quiz: [
          {
            question: 'StatelessWidget 대신 StatefulWidget을 써야 하는 경우는?',
            options: [
              '위젯의 모양이나 데이터가 생명주기 동안 바뀌어야 할 때',
              '위젯이 다른 위젯을 자식으로 가질 때',
              '위젯에 생성자 매개변수가 있을 때',
              '위젯이 Material 디자인을 사용할 때',
            ],
            answer: 0,
            explanation: '시간에 따라 데이터가 바뀌고 UI가 그에 맞춰 갱신되어야 한다면 StatefulWidget이 필요합니다.',
          },
          {
            question: 'State 객체의 데이터를 바꾸면서 setState를 호출하지 않으면?',
            options: [
              '데이터는 바뀌지만 Flutter가 UI를 다시 그리지 않는다',
              '앱이 즉시 종료된다',
              '데이터 변경이 자동으로 취소된다',
              'Flutter가 알아서 다음 프레임에 다시 그린다',
            ],
            answer: 0,
            explanation: 'setState를 호출해야 프레임워크가 build를 다시 실행합니다. 호출하지 않으면 사용자는 변화를 볼 수 없습니다.',
          },
          {
            question: 'State 객체에서 TextEditingController, FocusNode 같은 리소스를 해제하는 생명주기 메서드는?',
            options: ['dispose()', 'initState()', 'build()', 'createState()'],
            answer: 0,
            explanation: 'dispose()에서 컨트롤러와 FocusNode를 dispose()한 뒤 마지막에 super.dispose()를 호출합니다.',
          },
        ],
      },
      {
        id: 'implicit-animations',
        title: '암시적 애니메이션',
        summary: 'Container를 AnimatedContainer로 바꾸고 duration과 curve로 부드러운 전환을 만듭니다.',
        minutes: 20,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/implicit-animations`,
        goals: [
          'Flutter의 암시적 애니메이션 개념을 이해한다',
          'AnimatedContainer로 속성 변화를 애니메이션한다',
          'duration과 curve로 타이밍을 조절한다',
        ],
        quiz: [
          {
            question: '색상, 크기, 장식 같은 속성 변화를 자동으로 애니메이션하는 위젯은?',
            options: ['AnimatedContainer', 'Container', 'AnimationController', 'TransitionContainer'],
            answer: 0,
            explanation:
              'AnimatedContainer는 속성이 바뀌면 duration 동안 자동으로 보간합니다. AnimationController는 명시적 애니메이션용이며 TransitionContainer는 존재하지 않습니다.',
          },
          {
            question: 'AnimatedContainer의 `duration` 속성이 제어하는 것은?',
            options: [
              '이전 값에서 새 값으로 전환되는 데 걸리는 시간',
              '위젯이 화면에 보이는 시간',
              '애니메이션 시작 전 지연 시간',
              '애니메이션 반복 횟수',
            ],
            answer: 0,
            explanation: 'duration은 속성 변화가 애니메이션되는 시간입니다. 예: `Duration(milliseconds: 500)`은 0.5초.',
          },
          {
            question: '애니메이션 속도가 진행 중에 어떻게 변할지(가속, 튕김 등)를 지정하는 속성은?',
            options: ['curve', 'duration', 'alignment', 'child'],
            answer: 0,
            explanation: '`curve: Curves.bounceIn`처럼 Curves 클래스의 값을 지정해 애니메이션의 느낌을 바꿉니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'state-management',
    title: 'Flutter 앱의 상태 관리',
    subtitle: 'Wikipedia 리더로 배우는 HTTP 요청과 MVVM',
    description:
      'Wikipedia API에서 무작위 문서 요약을 받아 보여 주는 앱을 만들며 HTTP 요청, ChangeNotifier, ListenableBuilder, MVVM 패턴을 익힙니다.',
    level: '초급',
    project: 'Wikipedia 리더',
    sourceUrl: `${DOCS}/learn/pathway/tutorial/set-up-state-project`,
    lessons: [
      {
        id: 'set-up-project',
        title: '프로젝트 준비와 패키지 추가',
        summary: 'http 패키지를 추가하고 Wikipedia 응답을 담을 Summary 데이터 모델을 준비합니다.',
        minutes: 20,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/set-up-state-project`,
        goals: [
          '만들 Wikipedia 리더 앱의 구조를 파악한다',
          'flutter pub add로 http 패키지를 추가한다',
          'JSON을 Dart 객체로 바꾸는 데이터 모델을 준비한다',
        ],
        quiz: [
          {
            question: 'Flutter 프로젝트에 패키지 의존성을 추가하는 명령어는?',
            options: ['flutter pub add [패키지명]', 'flutter install [패키지명]', 'npm install [패키지명]', 'dart get [패키지명]'],
            answer: 0,
            explanation: 'flutter pub add는 pubspec.yaml에 패키지를 추가하고 바로 내려받습니다.',
          },
          {
            question: '`flutter create --empty`로 프로젝트를 만들면?',
            options: [
              '기본 카운터 예제 없이 최소한의 코드로 시작한다',
              'lib 폴더가 없는 프로젝트가 만들어진다',
              '모든 플랫폼 폴더가 생략된다',
              '의존성을 전혀 설치하지 않는다',
            ],
            answer: 0,
            explanation: '--empty 플래그는 카운터 앱 대신 Hello World만 있는 최소 템플릿을 생성합니다.',
          },
          {
            question: '`Summary.fromJson`에서 JSON 구조를 검사하면서 값을 꺼내는 데 사용한 Dart 기능은?',
            options: ['패턴 매칭(switch 식과 맵 패턴)', '리플렉션(dart:mirrors)', 'build_runner 코드 생성', '정규식'],
            answer: 0,
            explanation: "`{'pageid': final int pageId, ...}` 같은 맵 패턴은 구조와 타입을 검사하는 동시에 변수에 값을 바인딩합니다.",
          },
        ],
      },
      {
        id: 'http-requests',
        title: '인터넷에서 데이터 가져오기',
        summary: 'MVVM의 Model 계층으로 async/await HTTP 요청과 오류 처리, JSON 파싱을 구현합니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/http-requests`,
        goals: [
          'MVVM 아키텍처 패턴을 이해한다',
          'async/await로 HTTP 요청을 만든다',
          '상태 코드로 오류를 처리하고 JSON 응답을 파싱한다',
        ],
        quiz: [
          {
            question: 'Dart의 `async`와 `await`가 하는 일은?',
            options: [
              '함수를 비동기로 표시하고, Future가 완료될 때까지 실행을 잠시 멈춘다',
              '새 스레드를 만들어 코드를 병렬 실행한다',
              '함수를 컴파일 타임에 실행한다',
              '예외를 자동으로 무시한다',
            ],
            answer: 0,
            explanation: 'Dart는 단일 스레드 이벤트 루프에서 동작하며, async/await는 스레드 없이 비동기 작업을 순차 코드처럼 쓰게 해 줍니다.',
          },
          {
            question: 'URL을 만들 때 문자열 연결보다 `Uri.https`를 권장하는 이유는?',
            options: [
              '특수 문자와 쿼리 매개변수의 인코딩·형식을 안전하게 처리한다',
              '요청 속도가 빨라진다',
              'HTTPS 인증서를 자동 발급한다',
              '응답을 자동으로 캐시한다',
            ],
            answer: 0,
            explanation: 'Uri.https는 호스트, 경로, 쿼리를 올바르게 인코딩해 URL 조립 실수를 막아 줍니다.',
          },
          {
            question: 'MVVM에서 HTTP 요청 같은 데이터 작업을 담당하는 계층은?',
            options: ['Model', 'View', 'ViewModel', 'Widget'],
            answer: 0,
            explanation: 'Model은 데이터 작업, ViewModel은 상태 관리, View는 UI 표시를 담당합니다.',
          },
        ],
      },
      {
        id: 'change-notifier',
        title: 'ChangeNotifier로 상태 관리하기',
        summary: 'ArticleViewModel에서 로딩·성공·오류 상태를 관리하고 notifyListeners로 변경을 알립니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/change-notifier`,
        goals: [
          'ChangeNotifier를 상속한 ViewModel을 만든다',
          '로딩, 성공, 오류 상태를 관리한다',
          'notifyListeners로 UI 갱신을 알린다',
        ],
        quiz: [
          {
            question: 'ChangeNotifier란?',
            options: [
              '데이터가 바뀌면 리스너에게 알려 반응형 UI 갱신을 가능하게 하는 클래스',
              'HTTP 요청을 보내는 클래스',
              '화면 전환 애니메이션을 담당하는 위젯',
              '앱 테마를 바꾸는 유틸리티',
            ],
            answer: 0,
            explanation: 'ChangeNotifier를 상속하면 notifyListeners() 메서드로 등록된 리스너에게 변경을 알릴 수 있습니다.',
          },
          {
            question: '`notifyListeners()`를 호출하면?',
            options: [
              '이 객체를 듣고 있는 위젯들이 새 상태를 반영하도록 다시 빌드된다',
              '앱 전체가 재시작된다',
              '모든 리스너가 해제된다',
              'HTTP 요청이 다시 전송된다',
            ],
            answer: 0,
            explanation: 'notifyListeners()는 ListenableBuilder 같은 리스너에게 변경을 알려 다시 빌드하게 합니다.',
          },
          {
            question: 'fetchArticle()에서 `isLoading = true` 직후 notifyListeners()를 호출하는 이유는?',
            options: [
              'UI가 로딩 표시기를 보여 줄 수 있도록 알리기 위해',
              'HTTP 요청을 취소하기 위해',
              '메모리를 해제하기 위해',
              '오류를 무시하기 위해',
            ],
            answer: 0,
            explanation: '요청 시작 시 로딩 상태를 알리면 UI가 CircularProgressIndicator 등을 즉시 표시할 수 있습니다.',
          },
        ],
      },
      {
        id: 'listenable-builder',
        title: 'ListenableBuilder로 UI 갱신하기',
        summary: 'ListenableBuilder와 switch 식으로 모든 상태를 처리하는 View 계층을 완성합니다.',
        minutes: 35,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/listenable-builder`,
        goals: [
          'ListenableBuilder로 UI를 자동으로 다시 빌드한다',
          'switch 식으로 로딩·오류·성공 상태를 모두 처리한다',
          '스타일이 적용된 View 계층을 완성한다',
        ],
        quiz: [
          {
            question: 'ListenableBuilder의 목적은?',
            options: [
              'ChangeNotifier를 듣다가 notifyListeners()가 호출되면 builder를 다시 실행한다',
              '위젯 목록을 지연 생성한다',
              '네트워크 응답을 캐시한다',
              '페이지 이동 기록을 관리한다',
            ],
            answer: 0,
            explanation: 'ListenableBuilder는 ViewModel과 View를 연결하는 핵심 위젯으로, 알림을 받으면 builder로 UI를 다시 만듭니다.',
          },
          {
            question: '`switch ((viewModel.isLoading, viewModel.summary, viewModel.error))`에서 `(true, _, _)` 패턴이 처리하는 상태는?',
            options: ['로딩 중', '오류 발생', '데이터 로드 완료', '초기화 전'],
            answer: 0,
            explanation: '첫 요소 isLoading이 true이면 나머지 값과 관계없이(_ 와일드카드) 로딩 표시기를 보여 줍니다.',
          },
          {
            question: 'ArticleWidget에서 description이 있을 때만 Text를 표시하는 데 사용한 문법은?',
            options: ['컬렉션 if', 'Visibility 위젯', 'try-catch', 'late 키워드'],
            answer: 0,
            explanation: '`if (summary.description != null) Text(...)`처럼 children 리스트 안에서 조건부로 위젯을 넣습니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'flutter-ui-102',
    title: 'Flutter UI 102',
    subtitle: 'iOS 연락처 앱 Rolodex로 배우는 적응형 UI',
    description:
      'Cupertino 위젯으로 iOS 연락처 앱을 부분 복제하며 LayoutBuilder 적응형 레이아웃, 슬리버 스크롤, 스택 기반 내비게이션을 익힙니다.',
    level: '중급',
    project: 'Rolodex',
    sourceUrl: `${DOCS}/learn/pathway/tutorial/advanced-ui`,
    lessons: [
      {
        id: 'advanced-ui',
        title: 'Cupertino 프로젝트와 데이터 모델',
        summary: 'CupertinoApp으로 프로젝트를 만들고 연락처·그룹 데이터 모델과 ValueNotifier를 준비합니다.',
        minutes: 25,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/advanced-ui`,
        goals: [
          '만들 Rolodex 앱의 구조를 파악한다',
          'Cupertino 위젯 기반 프로젝트를 설정한다',
          '연락처와 그룹 데이터 모델을 만든다',
        ],
        quiz: [
          {
            question: 'CupertinoApp과 MaterialApp의 주요 차이는?',
            options: [
              'CupertinoApp은 iOS 스타일, MaterialApp은 Material Design 위젯과 스타일을 제공한다',
              'CupertinoApp은 iOS 기기에서만 실행된다',
              'MaterialApp은 웹에서 실행할 수 없다',
              '둘은 이름만 다르고 기능이 같다',
            ],
            answer: 0,
            explanation: 'CupertinoApp은 iOS 스타일 위젯과 테마를 제공하지만 모든 플랫폼에서 실행할 수 있습니다.',
          },
          {
            question: 'ValueNotifier의 역할은?',
            options: [
              '값 하나를 보관하고 그 값이 바뀌면 리스너에게 알린다',
              '여러 화면의 라우트를 관리한다',
              '위젯의 크기 제약을 계산한다',
              '비동기 스트림을 생성한다',
            ],
            answer: 0,
            explanation: 'ValueNotifier는 값 하나를 감싼 간단한 ChangeNotifier로, `value`가 바뀌면 리스너에게 알립니다.',
          },
        ],
      },
      {
        id: 'adaptive-layout',
        title: 'LayoutBuilder와 적응형 레이아웃',
        summary: '화면 너비에 따라 휴대폰은 단일 화면, 태블릿·데스크톱은 사이드바+상세 레이아웃을 보여 줍니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/adaptive-layout`,
        goals: [
          'LayoutBuilder로 반응형 레이아웃을 만든다',
          '화면 크기를 감지해 다른 레이아웃을 고른다',
          '큰 화면용 사이드바+상세 레이아웃을 만든다',
        ],
        quiz: [
          {
            question: 'LayoutBuilder가 builder 콜백에 전달하는 정보는?',
            options: [
              '부모가 허용하는 크기 제약(최대 너비·높이 등)',
              '기기의 운영체제와 화면 방향',
              '현재 테마 색상과 타이포그래피',
              '위젯 트리의 자식 개수',
            ],
            answer: 0,
            explanation: 'builder는 BoxConstraints를 받으며, `constraints.maxWidth`로 사용 가능한 너비를 확인할 수 있습니다.',
          },
          {
            question: '큰 화면에서 사이드바와 상세 패널을 나란히 배치할 때 쓰는 위젯은?',
            options: ['Row', 'Column', 'Stack', 'ListView'],
            answer: 0,
            explanation: 'Row는 자식을 가로로 배치합니다. Column은 세로, Stack은 겹쳐 쌓기, ListView는 스크롤 목록입니다.',
          },
          {
            question: '튜토리얼에서 휴대폰과 태블릿 크기를 구분하는 기준으로 사용한 너비는?',
            options: ['600픽셀', '320픽셀', '1024픽셀', '1920픽셀'],
            answer: 0,
            explanation: '`largeScreenMinWidth = 600`은 휴대폰과 태블릿을 나누는 흔한 기준점입니다.',
          },
        ],
      },
      {
        id: 'slivers',
        title: '고급 스크롤과 슬리버',
        summary: 'CustomScrollView와 슬리버로 접히는 내비게이션 바, 검색, 알파벳 섹션 목록을 만듭니다.',
        minutes: 35,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/slivers`,
        goals: [
          '슬리버와 일반 위젯의 차이를 이해한다',
          'CustomScrollView로 스크롤 레이아웃을 구성한다',
          '검색이 포함된 접히는 내비게이션 바를 만든다',
        ],
        quiz: [
          {
            question: '슬리버와 일반 위젯의 핵심 차이는?',
            options: [
              '슬리버는 스크롤 레이아웃 전용 위젯으로, CustomScrollView 같은 스크롤 뷰의 직접 자식으로만 쓸 수 있다',
              '슬리버는 애니메이션 전용 위젯이다',
              '슬리버는 상태를 가질 수 없다',
              '슬리버는 iOS에서만 동작한다',
            ],
            answer: 0,
            explanation: '슬리버는 CustomScrollView, NestedScrollView 같은 스크롤 뷰 안에서 동작하도록 설계된 특수 위젯입니다.',
          },
          {
            question: 'CustomScrollView의 slivers 목록에 일반 위젯을 넣으려면?',
            options: [
              'SliverToBoxAdapter나 SliverFillRemaining으로 감싼다',
              'Expanded로 감싼다',
              'const를 붙인다',
              'StatefulWidget으로 바꾼다',
            ],
            answer: 0,
            explanation: '이 어댑터들이 일반 위젯을 슬리버로 변환해 줍니다.',
          },
        ],
      },
      {
        id: 'navigation',
        title: '스택 기반 내비게이션',
        summary: 'Navigator.push와 CupertinoPageRoute로 화면을 이동하고 화면 크기별 내비게이션 방식을 나눕니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/learn/pathway/tutorial/navigation`,
        goals: [
          'Navigator.push로 화면 사이를 이동한다',
          'CupertinoPageRoute로 iOS 스타일 전환을 적용한다',
          '화면 크기마다 다른 내비게이션 패턴을 만든다',
        ],
        quiz: [
          {
            question: '`Navigator.of(context).push`가 하는 일은?',
            options: [
              '새 라우트를 내비게이션 스택에 추가해 현재 화면 위에 표시한다',
              '현재 화면을 스택에서 제거한다',
              '앱 전체를 다시 시작한다',
              '모든 라우트를 교체한다',
            ],
            answer: 0,
            explanation: 'push는 새 라우트를 스택 맨 위에 쌓아, 사용자가 뒤로 가기로 이전 화면에 돌아올 수 있게 합니다.',
          },
          {
            question: '`Navigator.of(context).pop()`이 하는 일은?',
            options: [
              '현재 라우트를 스택에서 제거하고 이전 화면으로 돌아간다',
              '새 화면을 스택에 추가한다',
              '스택을 모두 비운다',
              '앱을 종료한다',
            ],
            answer: 0,
            explanation: 'pop은 스택 맨 위 라우트를 제거해 그 아래 화면을 드러냅니다.',
          },
          {
            question: 'CupertinoPageRoute가 제공하는 기능이 아닌 것은?',
            options: [
              'Material 리플(ripple) 효과',
              '오른쪽에서 밀려 들어오는 전환 애니메이션',
              '자동 뒤로 가기 버튼',
              '스와이프로 뒤로 가기 제스처',
            ],
            answer: 0,
            explanation: 'CupertinoPageRoute는 iOS 스타일 슬라이드 전환, 뒤로 가기 버튼, 제목 처리, 스와이프 뒤로 가기를 제공합니다. 리플은 Material 효과입니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'how-flutter-works',
    title: 'Flutter 동작 원리',
    subtitle: '세 개의 트리와 레이아웃 제약 조건',
    description:
      'Flutter의 계층 구조(임베더·엔진·프레임워크), Widget·Element·RenderObject 트리, "제약은 내려가고 크기는 올라간다" 규칙을 이해합니다.',
    level: '중급',
    project: null,
    sourceUrl: `${DOCS}/learn/pathway/how-flutter-works`,
    lessons: [
      {
        id: 'architecture',
        title: '아키텍처와 세 개의 트리',
        summary: '임베더·엔진·프레임워크 계층과 Widget·Element·RenderObject 트리, State 생명주기를 살펴봅니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/resources/architectural-overview`,
        goals: [
          'Flutter의 계층 구조(임베더, 엔진, 프레임워크)를 설명할 수 있다',
          'Widget, Element, RenderObject 트리의 역할을 구분한다',
          'State 객체의 생명주기와 렌더링 파이프라인을 이해한다',
        ],
        quiz: [
          {
            question: '대부분 C++로 작성되어 래스터화, 텍스트 레이아웃, Dart 런타임 등을 담당하는 계층은?',
            options: ['엔진(Engine)', '프레임워크(Framework)', '임베더(Embedder)', 'Material 라이브러리'],
            answer: 0,
            explanation: 'Flutter 엔진은 주로 C++로 작성되었으며 dart:ui를 통해 저수준 기능을 프레임워크에 노출합니다.',
          },
          {
            question: '프레임이 바뀌어도 유지(persistent)되어, 위젯을 매번 새로 만들어도 성능을 지켜 주는 트리는?',
            options: ['Element 트리', 'Widget 트리', 'Semantics 트리', 'Route 트리'],
            answer: 0,
            explanation: '위젯은 불변이라 매번 새로 만들어지지만, Element 트리는 프레임 간 유지되며 바뀐 부분만 재구성합니다.',
          },
          {
            question: '`build()` 메서드에 대한 설명으로 옳은 것은?',
            options: [
              '빠르게 실행되어야 하며 부작용이 없어야 한다',
              '앱 실행 중 딱 한 번만 호출된다',
              '네트워크 요청을 보내기에 가장 좋은 곳이다',
              '반드시 async 함수여야 한다',
            ],
            answer: 0,
            explanation: 'build()는 프레임마다 호출될 수도 있으므로 빠르고 부작용 없이 작성해야 합니다.',
          },
        ],
      },
      {
        id: 'constraints',
        title: '제약 조건 이해하기',
        summary: '"제약은 내려가고, 크기는 올라가며, 위치는 부모가 정한다" 규칙을 예제로 익힙니다.',
        minutes: 30,
        sourceUrl: `${DOCS}/ui/layout/constraints`,
        goals: [
          'Flutter 레이아웃의 핵심 규칙을 설명할 수 있다',
          'tight/loose 제약과 위젯의 크기 결정 방식을 이해한다',
          'Center, ConstrainedBox, Expanded 등이 제약에 미치는 영향을 예측한다',
        ],
        quiz: [
          {
            question: 'Flutter 레이아웃의 핵심 규칙은?',
            options: [
              '제약은 내려가고, 크기는 올라가며, 위치는 부모가 정한다',
              '크기는 내려가고, 제약은 올라가며, 위치는 자식이 정한다',
              '모든 위젯은 원하는 크기와 위치를 스스로 정한다',
              '화면이 모든 위젯의 크기를 직접 정한다',
            ],
            answer: 0,
            explanation: 'Constraints go down. Sizes go up. Parent sets position.',
          },
          {
            question: '`Center(child: Container(width: 100, height: 100, color: red))`의 결과는?',
            options: [
              '화면 가운데에 100×100 빨간 상자가 그려진다',
              '화면 전체가 빨갛게 칠해진다',
              '아무것도 보이지 않는다',
              '레이아웃 오류가 발생한다',
            ],
            answer: 0,
            explanation: 'Center는 화면을 채우지만 자식에게 느슨한(loose) 제약을 주므로 Container가 원하는 100×100이 됩니다.',
          },
          {
            question: 'min 70·max 150인 ConstrainedBox 안의 `Container(width: 10, height: 10)` 크기는?',
            options: ['70×70', '10×10', '150×150', '화면 전체'],
            answer: 0,
            explanation: 'Container는 10을 원하지만 부모 제약의 최솟값이 70이므로 70×70이 됩니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'testing-and-release',
    title: '테스트와 배포',
    subtitle: '단위·위젯 테스트와 릴리스 빌드',
    description:
      '단위·위젯·통합 테스트의 차이를 이해하고 직접 작성해 본 뒤, Android 앱 번들과 웹 릴리스 빌드를 만들어 배포 과정을 익힙니다.',
    level: '중급',
    project: null,
    sourceUrl: `${DOCS}/testing/overview`,
    lessons: [
      {
        id: 'testing',
        title: '단위 테스트와 위젯 테스트',
        summary: 'test · flutter_test로 클래스 로직과 위젯을 검증하고 테스트 종류별 장단점을 비교합니다.',
        minutes: 40,
        sourceUrl: `${DOCS}/testing/overview`,
        goals: [
          '단위·위젯·통합 테스트의 차이와 장단점을 설명할 수 있다',
          'test, group, expect로 단위 테스트를 작성한다',
          'testWidgets, pumpWidget, Finder, Matcher로 위젯 테스트를 작성한다',
        ],
        quiz: [
          {
            question: '신뢰도는 가장 높지만 유지 비용이 가장 크고 실행이 가장 느린 테스트는?',
            options: ['통합 테스트', '단위 테스트', '위젯 테스트', '골든 테스트'],
            answer: 0,
            explanation: '통합 테스트는 실제 기기나 에뮬레이터에서 앱 전체를 검증하므로 신뢰도가 높지만 느리고 비용이 큽니다.',
          },
          {
            question: '`find.text(\'T\')`로 찾은 위젯이 트리에 정확히 하나 있는지 검증하는 Matcher는?',
            options: ['findsOneWidget', 'findsWidgets', 'findsNothing', 'findsNWidgets(0)'],
            answer: 0,
            explanation: 'findsOneWidget은 정확히 하나, findsWidgets는 하나 이상, findsNothing은 없음을 검증합니다.',
          },
          {
            question: '`tester.pumpAndSettle()`의 동작은?',
            options: [
              '예약된 프레임이 없을 때까지 pump()를 반복해 애니메이션이 끝나기를 기다린다',
              '위젯을 처음 한 번만 빌드한다',
              '테스트를 즉시 통과시킨다',
              '앱을 실제 기기에 설치한다',
            ],
            answer: 0,
            explanation: 'pumpAndSettle()은 더 이상 예약된 프레임이 없을 때까지 pump()를 반복 호출합니다.',
          },
        ],
      },
      {
        id: 'release',
        title: '앱 빌드와 배포',
        summary: 'Android 앱 서명과 appbundle 빌드, flutter build web과 호스팅 배포 과정을 익힙니다.',
        minutes: 35,
        sourceUrl: `${DOCS}/deployment/android`,
        goals: [
          'Android 업로드 키로 앱을 서명하는 과정을 이해한다',
          'flutter build appbundle로 Google Play용 릴리스를 만든다',
          'flutter build web으로 웹 릴리스를 만들고 호스팅에 배포한다',
        ],
        quiz: [
          {
            question: 'Google Play 업로드에 권장되는 형식을 만드는 명령어는?',
            options: ['flutter build appbundle', 'flutter build apk --debug', 'flutter run --release', 'flutter build web'],
            answer: 0,
            explanation: 'Google Play는 APK보다 앱 번들(.aab)을 선호하며, 결과물은 build/app/outputs/bundle/release/app.aab에 생성됩니다.',
          },
          {
            question: 'key.properties와 keystore 파일은 어떻게 다뤄야 하나요?',
            options: [
              '비공개로 보관하고 버전 관리(Git)에 커밋하지 않는다',
              '팀 공유를 위해 공개 저장소에 커밋한다',
              'pubspec.yaml에 내용을 붙여 넣는다',
              '빌드할 때마다 새로 만든다',
            ],
            answer: 0,
            explanation: '서명 키와 비밀번호가 유출되면 앱 업데이트 권한이 위협받습니다. 반드시 비공개로 관리하세요.',
          },
          {
            question: '`flutter build web`의 결과물이 생성되는 경로는?',
            options: ['build/web', 'web/build', 'dist', 'out/web'],
            answer: 0,
            explanation: '웹 릴리스 빌드는 프로젝트의 build/web 디렉터리에 생성되며, 이 폴더를 호스팅 서비스에 올립니다.',
          },
        ],
      },
    ],
  },
];
