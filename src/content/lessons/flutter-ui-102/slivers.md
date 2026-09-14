## 이 레슨에서 할 일

iOS 연락처 앱처럼 **스크롤하면 큰 제목이 접히고**, 검색창이 있고, 연락처가 **알파벳 섹션**으로 나뉜 화면을 만듭니다. 이런 고급 스크롤 효과는 **슬리버(sliver)**로 구현합니다.

## 1. 슬리버와 위젯

- **위젯**: 위젯 트리 어디에나 쓸 수 있는 일반 UI 구성 요소입니다.
- **슬리버**: **스크롤 레이아웃 전용**으로 설계된 특수 위젯입니다.

슬리버에는 다음 규칙이 있습니다.

- 슬리버는 `CustomScrollView`, `NestedScrollView` 같은 **스크롤 뷰의 직접 자식으로만** 쓸 수 있습니다.
- `CustomScrollView.slivers`처럼 **슬리버만 받는** 속성도 있습니다.
- 일반 위젯을 슬리버 자리에 넣으려면 `SliverToBoxAdapter`나 `SliverFillRemaining`으로 감쌉니다.

이렇게 역할을 나눈 덕분에 Flutter는 화면에 보이는 부분만 효율적으로 배치해 스크롤 성능을 최적화할 수 있습니다.

## 2. 연락처 그룹 페이지에 슬리버 구조 추가

사이드바와 단독 페이지에서 **같은 목록 UI를 재사용**하기 위해 `_ContactGroupsView`를 만듭니다. `lib/screens/contact_groups.dart`를 다음처럼 바꿉니다.

```dart
import 'package:flutter/cupertino.dart';

import '../data/contact.dart';
import '../data/contact_group.dart';
import '../main.dart';

class ContactGroupsPage extends StatelessWidget {
  const ContactGroupsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _ContactGroupsView(
      selectedListId: 0,
      onListSelected: (list) {
        debugPrint(list.toString());
      },
    );
  }
}

class _ContactGroupsView extends StatelessWidget {
  const _ContactGroupsView({required this.onListSelected, this.selectedListId});

  final int? selectedListId;
  final void Function(ContactGroup) onListSelected;

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: CupertinoColors.extraLightBackgroundGray,
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(largeTitle: Text('Lists')),
          SliverFillRemaining(
            child: ValueListenableBuilder<List<ContactGroup>>(
              valueListenable: contactGroupsModel.listsNotifier,
              builder: (context, contactLists, child) {
                return CupertinoListSection.insetGrouped(
                  header: const Text('iPhone'),
                  children: [
                    for (final ContactGroup contactList in contactLists)
                      CupertinoListTile(
                        title: Text(contactList.label),
                        onTap: () => onListSelected(contactList),
                      ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

| 위젯 | 역할 |
| --- | --- |
| `CustomScrollView` | 여러 슬리버를 조합하는 스크롤 뷰 |
| `CupertinoSliverNavigationBar` | 스크롤하면 큰 제목이 작게 접히는 iOS 스타일 내비게이션 바 |
| `SliverFillRemaining` | 남은 공간을 채우는 슬리버. 자식은 일반 위젯 |
| `ValueListenableBuilder` | `ValueNotifier`의 값이 바뀌면 다시 빌드 |
| `CupertinoListSection.insetGrouped` | 둥근 모서리 카드 형태의 iOS 목록 섹션 |

## 3. 아이콘과 개수 표시 추가

`_ContactGroupsView`에 목록 오른쪽에 연락처 수와 화살표를 표시하는 헬퍼 메서드를 추가합니다.

```dart
Widget _buildTrailing(List<Contact> contacts, BuildContext context) {
  final TextStyle style = CupertinoTheme.of(context).textTheme.textStyle
      .copyWith(color: CupertinoColors.systemGrey);

  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(contacts.length.toString(), style: style),
      const Icon(
        CupertinoIcons.forward,
        color: CupertinoColors.systemGrey3,
        size: 18,
      ),
    ],
  );
}
```

`ValueListenableBuilder`의 builder에서 아이콘과 `_buildTrailing`을 사용합니다.

```dart
builder: (context, contactLists, child) {
  const groupIcon = Icon(CupertinoIcons.group, weight: 900, size: 32);
  const pairIcon = Icon(CupertinoIcons.person_2, weight: 900, size: 24);

  return CupertinoListSection.insetGrouped(
    header: const Text('iPhone'),
    children: [
      for (final ContactGroup contactList in contactLists)
        CupertinoListTile(
          leading: contactList.id == 0 ? groupIcon : pairIcon,
          title: Text(contactList.label),
          trailing: _buildTrailing(contactList.contacts, context),
          onTap: () => onListSelected(contactList),
        ),
    ],
  );
},
```

`mainAxisSize: MainAxisSize.min`은 `Row`가 가로 공간을 모두 차지하지 않고 **내용 크기만큼만** 차지하게 합니다.

## 4. 연락처 목록 화면 만들기

작업 중인 화면을 바로 보기 위해 `adaptive_layout.dart`의 작은 화면 분기를 잠시 바꿉니다.

```dart
import 'contacts.dart';

// build 안의 else 분기
return const ContactListsPage(listId: 0); // 임시
```

`lib/screens/contacts.dart`를 다음처럼 구성합니다.

```dart
import 'package:flutter/cupertino.dart';

import '../data/contact.dart';
import '../data/contact_group.dart';
import '../main.dart';

class ContactListsPage extends StatelessWidget {
  const ContactListsPage({super.key, required this.listId});

  final int listId;

  @override
  Widget build(BuildContext context) {
    return _ContactListView(listId: listId);
  }
}

class _ContactListView extends StatelessWidget {
  const _ContactListView({
    required this.listId,
    this.automaticallyImplyLeading = true,
  });

  final int listId;
  final bool automaticallyImplyLeading;

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      child: ValueListenableBuilder<List<ContactGroup>>(
        valueListenable: contactGroupsModel.listsNotifier,
        builder: (context, contactGroups, child) {
          final contactList = contactGroupsModel.findContactList(listId);

          return CustomScrollView(
            slivers: [
              CupertinoSliverNavigationBar(
                largeTitle: Text(contactList.title),
                automaticallyImplyLeading: automaticallyImplyLeading,
              ),
              SliverFillRemaining(
                child: Center(
                  child: Text(
                    '${contactList.contacts.length} contacts in ${contactList.label}',
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
```

`automaticallyImplyLeading`은 뒤로 가기 버튼을 자동으로 표시할지 정합니다. 큰 화면의 상세 영역에서는 끄게 됩니다.

## 5. 검색이 있는 내비게이션 바

`CupertinoSliverNavigationBar.search` 생성자로 바꾸면 **검색창이 통합된** 내비게이션 바가 됩니다. 아래로 스크롤하면 검색창이 접힌 내비게이션 바 안으로 자연스럽게 사라집니다.

```dart
CupertinoSliverNavigationBar.search(
  largeTitle: Text(contactList.title),
  automaticallyImplyLeading: automaticallyImplyLeading,
  searchField: const CupertinoSearchTextField(
    suffixIcon: Icon(CupertinoIcons.mic_fill),
    suffixMode: OverlayVisibilityMode.always,
  ),
),
```

## 6. 알파벳 섹션 위젯

`contacts.dart` 아래에 성의 첫 글자별 섹션을 그리는 위젯을 추가합니다.

```dart
class ContactListSection extends StatelessWidget {
  const ContactListSection({
    super.key,
    required this.lastInitial,
    required this.contacts,
  });

  final String lastInitial;
  final List<Contact> contacts;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(20, 0, 20, 0),
      child: Column(
        children: [
          const SizedBox(height: 15),
          Align(
            alignment: AlignmentDirectional.bottomStart,
            child: Text(
              lastInitial,
              style: const TextStyle(
                color: CupertinoColors.systemGrey,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          CupertinoListSection(
            backgroundColor: CupertinoColors.systemBackground,
            dividerMargin: 0,
            additionalDividerMargin: 0,
            topMargin: 4,
            children: [
              for (final Contact contact in contacts)
                CupertinoListTile(
                  padding: const EdgeInsets.all(0),
                  title: Text('${contact.firstName} ${contact.lastName}'),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
```

`EdgeInsetsDirectional`과 `AlignmentDirectional`은 왼쪽·오른쪽 대신 **시작(start)·끝(end)**을 기준으로 해서, 아랍어처럼 오른쪽에서 왼쪽으로 쓰는 언어에서도 올바르게 배치됩니다.

## 7. SliverList로 섹션 나열하기

`_ContactListView`의 `SliverFillRemaining` 자리를 `SliverList.list`로 바꿉니다.

```dart
builder: (context, contactGroups, child) {
  final contactList = contactGroupsModel.findContactList(listId);
  final contacts = contactList.alphabetizedContacts;

  return CustomScrollView(
    slivers: [
      CupertinoSliverNavigationBar.search(
        largeTitle: Text(contactList.title),
        automaticallyImplyLeading: automaticallyImplyLeading,
        searchField: const CupertinoSearchTextField(
          suffixIcon: Icon(CupertinoIcons.mic_fill),
          suffixMode: OverlayVisibilityMode.always,
        ),
      ),
      SliverList.list(
        children: [
          const SizedBox(height: 20),
          ...contacts.keys.map(
            (initial) => ContactListSection(
              lastInitial: initial,
              contacts: contacts[initial]!,
            ),
          ),
        ],
      ),
    ],
  );
},
```

`SliverList.list`는 일반 위젯 목록을 스크롤 영역에 넣는 가장 간단한 방법입니다. `alphabetizedContacts`가 `SplayTreeMap`이므로 `keys`는 A→Z 순서로 나옵니다.

> **항목이 아주 많다면** `SliverList.builder`를 쓰면 화면에 보이는 항목만 필요할 때 생성해 메모리와 성능을 아낄 수 있습니다.

## 핵심 정리

- **슬리버**는 스크롤 레이아웃 전용 위젯으로, `CustomScrollView` 같은 스크롤 뷰 안에서만 씁니다.
- `CupertinoSliverNavigationBar`, `SliverFillRemaining`, `SliverList`를 조합해 스크롤 화면을 구성했습니다.
- `.search` 생성자로 **검색창이 통합된 접히는 내비게이션 바**를 만들었습니다.
- 성의 첫 글자로 묶은 `ContactListSection`을 `SliverList.list`에 나열해 iOS 연락처 앱과 같은 화면을 만들었습니다.
