## 이 레슨에서 할 일

마지막으로 화면 사이를 이동하는 **내비게이션**을 추가해 Rolodex를 완성합니다. 화면 크기에 따라 내비게이션 방식도 달라집니다.

- `Navigator.push`로 새 화면으로 이동하기
- `CupertinoPageRoute`로 iOS 스타일 전환 적용하기
- 화면 크기마다 다른 내비게이션 패턴 만들기

## 1. 작은 화면 분기 되돌리기

이전 레슨에서 임시로 바꾼 `adaptive_layout.dart`의 작은 화면 분기를 다시 `ContactGroupsPage`로 되돌립니다.

```dart
@override
Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      final isLargeScreen = constraints.maxWidth > largeScreenMinWidth;

      if (isLargeScreen) {
        return _buildLargeScreenLayout();
      } else {
        return const ContactGroupsPage(); // 되돌림
      }
    },
  );
}
```

## 2. 스택 기반 내비게이션 추가

`lib/screens/contact_groups.dart`에서 그룹을 탭하면 연락처 목록 화면으로 이동하게 합니다.

```dart
import 'contacts.dart';

class ContactGroupsPage extends StatelessWidget {
  const ContactGroupsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _ContactGroupsView(
      onListSelected: (list) => Navigator.of(context).push(
        CupertinoPageRoute<void>(
          title: list.title,
          builder: (context) => ContactListsPage(listId: list.id),
        ),
      ),
    );
  }
}
```

- **`Navigator.of(context)`**: 위젯 트리에서 가장 가까운 `Navigator`를 찾습니다. `CupertinoApp`이 기본으로 하나 만들어 둡니다.
- **`push()`**: 새 **라우트**를 내비게이션 스택 맨 위에 쌓고 `builder`가 반환한 화면을 보여 줍니다.
- **`pop()`**: 맨 위 라우트를 제거해 이전 화면으로 돌아갑니다. 뒤로 가기 버튼이 내부적으로 호출합니다.

```text
push 전:  [ 그룹 목록 ]
push 후:  [ 그룹 목록 | 연락처 목록 ]   ← 맨 위 화면이 보임
pop 후:   [ 그룹 목록 ]
```

`CupertinoPageRoute`는 iOS 네이티브와 같은 경험을 제공합니다.

- 오른쪽에서 밀려 들어오는 **슬라이드 전환**
- 자동 **뒤로 가기 버튼**과 이전 화면 제목 표시
- 화면 왼쪽 가장자리에서 **스와이프해 뒤로 가기**

> **Material 앱이라면** `MaterialPageRoute`를 사용합니다. 사용법은 같고 플랫폼에 맞는 전환 애니메이션을 제공합니다.

## 3. 큰 화면용 사이드바

큰 화면에서는 화면을 이동하지 않고 **선택만 바꿉니다**. `contact_groups.dart` 아래에 사이드바 위젯을 추가합니다.

```dart
/// 큰 화면에서 연락처 그룹을 선택하는 사이드바
class ContactGroupsSidebar extends StatelessWidget {
  const ContactGroupsSidebar({
    super.key,
    required this.selectedListId,
    required this.onListSelected,
  });

  final int selectedListId;
  final void Function(int) onListSelected;

  @override
  Widget build(BuildContext context) {
    return _ContactGroupsView(
      selectedListId: selectedListId,
      onListSelected: (list) => onListSelected(list.id),
    );
  }
}
```

같은 `_ContactGroupsView`를 재사용하되, 콜백만 **"이동" 대신 "선택된 id 전달"**로 바꿨습니다.

## 4. 큰 화면용 상세 뷰

`contacts.dart` 아래에 추가합니다.

```dart
class ContactListDetail extends StatelessWidget {
  const ContactListDetail({super.key, required this.listId});

  final int listId;

  @override
  Widget build(BuildContext context) {
    return _ContactListView(listId: listId, automaticallyImplyLeading: false);
  }
}
```

사이드바가 이동을 담당하므로 상세 뷰에서는 `automaticallyImplyLeading: false`로 뒤로 가기 버튼을 숨깁니다.

## 5. 적응형 레이아웃에 연결하기

`adaptive_layout.dart`에 import를 추가하고 `_buildLargeScreenLayout()`의 자리 표시자를 실제 위젯으로 바꿉니다.

```dart
import 'package:flutter/cupertino.dart';

import 'contact_groups.dart';
import 'contacts.dart';
```

```dart
Widget _buildLargeScreenLayout() {
  return CupertinoPageScaffold(
    backgroundColor: CupertinoColors.extraLightBackgroundGray,
    child: SafeArea(
      child: Row(
        children: [
          SizedBox(
            width: 320,
            child: ContactGroupsSidebar(
              selectedListId: selectedListId,
              onListSelected: _onContactListSelected,
            ),
          ),
          Container(width: 1, color: CupertinoColors.separator),
          Expanded(child: ContactListDetail(listId: selectedListId)),
        ],
      ),
    ),
  );
}
```

사이드바에서 그룹을 고르면 `_onContactListSelected`가 `setState`로 `selectedListId`를 바꾸고, 상세 영역이 해당 그룹으로 다시 그려집니다.

## 6. 동작 확인하기

| 화면 너비 | 동작 |
| --- | --- |
| 600픽셀 이하 | 그룹을 탭하면 연락처 화면으로 **push**, 뒤로 가기 버튼이나 스와이프로 **pop** |
| 600픽셀 초과 | 사이드바에서 그룹을 클릭하면 상세 영역만 바뀜(스택 변화 없음) |

> **알려진 경계 사례** 작은 화면에서 연락처 화면으로 이동한 상태로 창을 크게 늘린 뒤 뒤로 가기를 누르면 `Hero` 태그 예외가 보일 수 있습니다. 이 튜토리얼의 단순한 구조에서 예상되는 현상입니다.

## 7. Rolodex 완성!

- `CupertinoApp` 기반 iOS 스타일 UI
- `LayoutBuilder` 적응형 레이아웃
- 슬리버로 만든 접히는 헤더와 검색
- 화면 크기별 내비게이션(push/pop과 목록-상세)

실제 앱에서도 흔히 쓰는 패턴을 모두 적용한 연락처 앱이 완성되었습니다.

## 핵심 정리

- `Navigator.of(context).push`는 새 라우트를 스택에 쌓고, `pop`은 맨 위 라우트를 제거합니다.
- `CupertinoPageRoute`는 슬라이드 전환, 뒤로 가기 버튼, 스와이프 제스처를 제공합니다.
- 작은 화면은 **스택 내비게이션**, 큰 화면은 **목록-상세** 패턴으로 같은 UI를 다르게 조합했습니다.
