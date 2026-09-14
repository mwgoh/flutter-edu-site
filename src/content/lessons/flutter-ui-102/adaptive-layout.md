## 이 레슨에서 할 일

요즘 앱은 휴대폰, 태블릿, 데스크톱 등 다양한 크기의 화면에서 잘 동작해야 합니다. 이번 레슨에서는 `LayoutBuilder`로 **화면 너비에 따라 레이아웃을 바꾸는** 적응형 UI를 만듭니다.

| 화면 | 레이아웃 |
| --- | --- |
| 큰 화면(태블릿, 데스크톱) | 연락처 그룹 사이드바와 연락처 상세를 **나란히** 표시 |
| 작은 화면(휴대폰) | 그룹 목록에서 상세 화면으로 **이동**하는 방식 |

## 1. 연락처 그룹 페이지

`lib/screens/contact_groups.dart`를 만듭니다.

```dart
import 'package:flutter/cupertino.dart';

class ContactGroupsPage extends StatelessWidget {
  const ContactGroupsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoPageScaffold(
      backgroundColor: CupertinoColors.extraLightBackgroundGray,
      child: Center(child: Text('Contact Groups will go here')),
    );
  }
}
```

## 2. 연락처 목록 페이지

`lib/screens/contacts.dart`를 만듭니다.

```dart
import 'package:flutter/cupertino.dart';

class ContactListsPage extends StatelessWidget {
  const ContactListsPage({super.key, required this.listId});

  final int listId;

  @override
  Widget build(BuildContext context) {
    return const CupertinoPageScaffold(
      backgroundColor: CupertinoColors.extraLightBackgroundGray,
      child: Center(child: Text('Lists of contacts will go here')),
    );
  }
}
```

## 3. LayoutBuilder로 화면 크기 감지하기

`lib/screens/adaptive_layout.dart`를 만듭니다.

```dart
import 'package:flutter/cupertino.dart';

import 'contact_groups.dart';

const largeScreenMinWidth = 600;

class AdaptiveLayout extends StatefulWidget {
  const AdaptiveLayout({super.key});

  @override
  State<AdaptiveLayout> createState() => _AdaptiveLayoutState();
}

class _AdaptiveLayoutState extends State<AdaptiveLayout> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isLargeScreen = constraints.maxWidth > largeScreenMinWidth;

        if (isLargeScreen) {
          return const Text('Large screen layout'); // 임시
        } else {
          return const ContactGroupsPage();
        }
      },
    );
  }
}
```

`LayoutBuilder`는 builder 콜백에 **부모가 허용하는 크기 제약**(`BoxConstraints`)을 넘겨 줍니다. `constraints.maxWidth`로 사용할 수 있는 너비를 확인해 레이아웃을 고릅니다. **600픽셀**은 휴대폰과 태블릿을 나누는 흔한 기준점입니다.

> **LayoutBuilder vs MediaQuery** `MediaQuery.sizeOf(context)`는 **앱 창 전체** 크기를, `LayoutBuilder`는 **이 위젯이 받은 공간**을 알려 줍니다. 화면 일부에 들어가는 위젯이 스스로 레이아웃을 정할 때는 `LayoutBuilder`가 더 정확합니다.

## 4. MainApp 연결하기

```dart
import 'package:flutter/cupertino.dart';

import 'data/contact_group.dart';
import 'screens/adaptive_layout.dart';

final contactGroupsModel = ContactGroupsModel();

void main() {
  runApp(const RolodexApp());
}

class RolodexApp extends StatelessWidget {
  const RolodexApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoApp(
      title: 'Rolodex',
      theme: CupertinoThemeData(
        barBackgroundColor: CupertinoDynamicColor.withBrightness(
          color: Color(0xFFF9F9F9),
          darkColor: Color(0xFF1D1D1D),
        ),
      ),
      home: AdaptiveLayout(),
    );
  }
}
```

Chrome에서 실행한 뒤 **브라우저 창 크기를 조절**하며 레이아웃이 바뀌는지 확인해 보세요.

## 5. 선택된 그룹 상태 추가하기

큰 화면에서는 사이드바에서 고른 그룹을 상세 영역에 보여 줘야 하므로, 선택된 그룹 id를 상태로 관리합니다.

```dart
class _AdaptiveLayoutState extends State<AdaptiveLayout> {
  int selectedListId = 0;

  void _onContactListSelected(int listId) {
    setState(() {
      selectedListId = listId;
    });
  }

  // build는 그대로
}
```

## 6. 큰 화면 레이아웃 만들기

임시 텍스트를 사이드바+상세 레이아웃으로 바꿉니다.

```dart
@override
Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      final isLargeScreen = constraints.maxWidth > largeScreenMinWidth;

      if (isLargeScreen) {
        return _buildLargeScreenLayout();
      } else {
        // 작은 화면에서는 기존의 내비게이션 방식을 사용한다.
        return const ContactGroupsPage();
      }
    },
  );
}

Widget _buildLargeScreenLayout() {
  return CupertinoPageScaffold(
    backgroundColor: CupertinoColors.extraLightBackgroundGray,
    child: SafeArea(
      child: Row(
        children: [
          const SizedBox(width: 320, child: Text('Sidebar placeholder')),
          Container(width: 1, color: CupertinoColors.separator),
          const Expanded(child: Text('Details placeholder')),
        ],
      ),
    ),
  );
}
```

| 구성 | 위젯 | 설명 |
| --- | --- | --- |
| 사이드바 | `SizedBox(width: 320)` | 너비 320픽셀로 고정 |
| 구분선 | `Container(width: 1)` | 1픽셀 세로선 |
| 상세 영역 | `Expanded` | 남은 너비를 모두 차지 |
| 안전 영역 | `SafeArea` | 노치, 상태 표시줄 같은 시스템 UI와 겹치지 않게 함 |

## 7. 테스트하기

핫 리로드한 뒤 창 크기를 바꿔 보세요.

- **600픽셀보다 넓으면**: 사이드바와 상세 영역이 나란히 표시됩니다.
- **600픽셀 이하이면**: 연락처 그룹 페이지만 표시됩니다.

사이드바와 상세 영역의 실제 내용은 다음 레슨들에서 채웁니다.

## 핵심 정리

- `LayoutBuilder`의 `constraints.maxWidth`로 **사용 가능한 공간에 따라** 레이아웃을 골랐습니다.
- 600픽셀 기준점으로 휴대폰 크기와 태블릿 크기를 구분했습니다.
- 큰 화면에서는 `Row` 안에 고정 너비 사이드바와 `Expanded` 상세 영역을 배치하는 **목록-상세(master-detail)** 패턴을 만들었습니다.
