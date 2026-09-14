## 이 레슨에서 할 일

추측을 제출하면 타일 색이 **순간적으로** 바뀝니다. 이번 레슨에서는 코드 두어 줄로 이 변화를 부드러운 애니메이션으로 바꾸고 Birdle 게임을 완성합니다.

- **암시적 애니메이션(implicit animation)** 이해하기
- `AnimatedContainer`로 속성 변화 애니메이션하기
- `duration`과 `curve`로 타이밍 조절하기

## 1. 암시적 애니메이션이란?

**암시적 애니메이션**은 속성 값이 바뀌면 **알아서** 이전 값에서 새 값으로 부드럽게 전환해 주는 위젯입니다. 개발자는 "어떻게" 움직일지 대신 **"최종 상태가 무엇인지"**만 지정하면 됩니다. 애니메이션 컨트롤러를 직접 만들고 관리할 필요가 없습니다.

## 2. Container를 AnimatedContainer로 바꾸기

`Tile`의 `Container`를 `AnimatedContainer`로 바꾸고 `duration`을 추가합니다.

```dart
class Tile extends StatelessWidget {
  const Tile(this.letter, this.hitType, {super.key});

  final String letter;
  final HitType hitType;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 500),
      height: 60,
      width: 60,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        color: switch (hitType) {
          HitType.hit => Colors.green,
          HitType.partial => Colors.yellow,
          HitType.miss => Colors.grey,
          _ => Colors.white,
        },
      ),
      child: Center(
        child: Text(
          letter.toUpperCase(),
          style: Theme.of(context).textTheme.titleLarge,
        ),
      ),
    );
  }
}
```

- `AnimatedContainer`는 `color`, `width`, `height`, `decoration`, `alignment` 같은 속성이 바뀌면 `duration` 동안 자동으로 보간합니다.
- **`duration`은 필수**입니다. `Duration(milliseconds: 500)`은 0.5초 동안 전환한다는 뜻입니다.

`hitType`이 바뀌어 위젯이 다시 빌드되면, 배경색이 이전 색에서 새 색으로 0.5초에 걸쳐 부드럽게 바뀝니다.

## 3. 애니메이션 곡선(curve) 조절하기

`curve`는 애니메이션이 진행되는 동안 **속도가 어떻게 변할지**를 정합니다. 곡선에 따라 같은 시간이라도 느낌이 달라집니다.

```dart
return AnimatedContainer(
  duration: const Duration(milliseconds: 500),
  curve: Curves.bounceIn, // 추가
  height: 60,
  width: 60,
  // ...
);
```

| 곡선 | 느낌 |
| --- | --- |
| `Curves.linear` | 처음부터 끝까지 일정한 속도(기본값) |
| `Curves.easeIn` | 천천히 시작해 점점 빨라짐 |
| `Curves.decelerate` | 빠르게 시작해 점점 느려짐 |
| `Curves.bounceIn` / `Curves.bounceOut` | 시작 / 끝에서 통통 튀는 효과 |
| `Curves.elasticIn` | 고무줄처럼 늘어나는 효과 |

여러 곡선으로 바꿔 가며 핫 리로드해 보고 게임에 어울리는 느낌을 골라 보세요.

## 4. 다른 암시적 애니메이션 위젯

`AnimatedContainer` 외에도 `Animated`로 시작하는 위젯이 많습니다.

- `AnimatedOpacity`: 투명도 변화
- `AnimatedAlign`: 정렬 위치 변화
- `AnimatedPadding`: 여백 변화
- `AnimatedDefaultTextStyle`: 텍스트 스타일 변화
- `TweenAnimationBuilder`: 원하는 값 타입을 직접 지정해 애니메이션

더 세밀한 제어(반복, 역재생, 여러 애니메이션 연결)가 필요하면 `AnimationController`를 쓰는 **명시적 애니메이션**을 사용합니다. 자세한 내용은 [애니메이션 문서](https://docs.flutter.dev/ui/animations)를 참고하세요.

## 5. Birdle 완성!

지금까지 만든 것을 돌아보면 다음과 같습니다.

1. **커스텀 위젯** `Tile`
2. `Scaffold`, `Column`, `Row`로 만든 **5×5 게임 보드**
3. `TextField`와 `IconButton`으로 만든 **입력 위젯**
4. `StatefulWidget`과 `setState`로 구현한 **상태 갱신**
5. `AnimatedContainer`로 만든 **부드러운 색 전환**

앱을 실행해 다섯 글자 단어를 추측해 보세요. 실제로 동작하는 Wordle 스타일 게임이 완성되었습니다.

## 핵심 정리

- 암시적 애니메이션은 **최종 상태만 지정**하면 전환을 자동으로 처리합니다.
- `Container`를 `AnimatedContainer`로 바꾸고 `duration`만 추가해도 속성 변화가 애니메이션됩니다.
- `curve`로 애니메이션의 속도 변화와 느낌을 조절합니다.
