## 만들 앱: Rolodex

이번 과정에서는 iOS **연락처(Contacts)** 앱을 부분적으로 따라 만든 **Rolodex**를 개발합니다. 과정을 마치면 다음을 배우게 됩니다.

- `LayoutBuilder`로 **반응형 레이아웃** 만들기
- 슬리버와 검색을 활용한 **고급 스크롤**
- **스택 기반 내비게이션** 패턴
- `CupertinoThemeData`로 테마 구성, 라이트·다크 모드 지원
- **Cupertino 위젯**으로 iOS 스타일 UI 만들기

이번 레슨에서는 프로젝트를 만들고 연락처 데이터 모델을 준비합니다.

## 1. 프로젝트 만들기

```bash
flutter create rolodex --empty
cd rolodex
flutter pub add cupertino_icons
```

`cupertino_icons`는 iOS 스타일 아이콘(`CupertinoIcons`)을 제공하는 공식 패키지입니다.

코드를 역할별로 정리할 폴더를 만듭니다.

```bash
mkdir lib/data lib/screens lib/theme
```

> **Windows PowerShell에서는** 여러 폴더를 쉼표로 구분합니다: `mkdir lib/data, lib/screens, lib/theme`

| 폴더 | 용도 |
| --- | --- |
| `lib/data/` | 데이터 모델 |
| `lib/screens/` | 화면 위젯 |
| `lib/theme/` | 테마 설정 |

## 2. CupertinoApp으로 시작하기

`lib/main.dart`를 다음 코드로 바꿉니다.

```dart
import 'package:flutter/cupertino.dart';

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
      home: CupertinoPageScaffold(child: Center(child: Text('Hello Rolodex!'))),
    );
  }
}
```

- **`CupertinoApp`**: `MaterialApp` 대신 사용하며 iOS 스타일 위젯과 테마를 제공합니다. iOS 전용이 아니라 **모든 플랫폼에서 실행**됩니다.
- **`CupertinoDynamicColor.withBrightness`**: 라이트 모드와 다크 모드에서 각각 다른 색을 쓰도록 지정합니다.
- **`CupertinoPageScaffold`**: Cupertino 스타일의 기본 페이지 뼈대입니다.

```bash
flutter run -d chrome
```

화면 가운데에 "Hello Rolodex!"가 보이면 준비 완료입니다.

## 3. 연락처 모델: lib/data/contact.dart

```dart
class Contact {
  Contact({
    required this.id,
    required this.firstName,
    this.middleName,
    required this.lastName,
    this.suffix,
  });

  final int id;
  final String firstName;
  final String lastName;
  final String? middleName;
  final String? suffix;
}

final johnAppleseed = Contact(id: 0, firstName: 'John', lastName: 'Appleseed');
final kateBell = Contact(id: 1, firstName: 'Kate', lastName: 'Bell');
final danielHiggins = Contact(
  id: 3,
  firstName: 'Daniel',
  lastName: 'Higgins',
  suffix: 'Jr.',
);
// ... 중간 이름·접미사가 있는 경우를 포함해 총 51명의 샘플 연락처

final Set<Contact> allContacts = {
  johnAppleseed,
  kateBell,
  danielHiggins,
  // ...
};
```

샘플 연락처 전체 목록은 [공식 튜토리얼 페이지](https://docs.flutter.dev/learn/pathway/tutorial/advanced-ui)에서 복사하세요. 중간 이름과 접미사(Jr., Sr., III 등)가 있는 이름이 섞여 있어 다양한 형태의 이름을 UI에서 시험할 수 있습니다.

## 4. 연락처 그룹 모델: lib/data/contact_group.dart

```dart
import 'dart:collection';

import 'package:flutter/cupertino.dart';

import 'contact.dart';

class ContactGroup {
  factory ContactGroup({
    required int id,
    required String label,
    bool permanent = false,
    String? title,
    List<Contact>? contacts,
  }) {
    final contactsCopy = contacts ?? <Contact>[];
    _sortContacts(contactsCopy);
    return ContactGroup._internal(
      id: id,
      label: label,
      permanent: permanent,
      title: title,
      contacts: contactsCopy,
    );
  }

  ContactGroup._internal({
    required this.id,
    required this.label,
    this.permanent = false,
    String? title,
    List<Contact>? contacts,
  }) : title = title ?? label,
       _contacts = contacts ?? const <Contact>[];

  final int id;
  final bool permanent;
  final String label;
  final String title;
  final List<Contact> _contacts;

  List<Contact> get contacts => _contacts;

  AlphabetizedContactMap get alphabetizedContacts {
    final contactsMap = AlphabetizedContactMap();
    for (final contact in _contacts) {
      final lastInitial = contact.lastName[0].toUpperCase();
      if (contactsMap.containsKey(lastInitial)) {
        contactsMap[lastInitial]!.add(contact);
      } else {
        contactsMap[lastInitial] = [contact];
      }
    }
    return contactsMap;
  }
}

typedef AlphabetizedContactMap = SplayTreeMap<String, List<Contact>>;

/// 성, 이름, 중간 이름 순으로 정렬하고, 이름이 같으면 id 순으로 정렬한다.
void _sortContacts(List<Contact> contacts) {
  contacts.sort((a, b) {
    final checkLastName = a.lastName.compareTo(b.lastName);
    if (checkLastName != 0) {
      return checkLastName;
    }
    final checkFirstName = a.firstName.compareTo(b.firstName);
    if (checkFirstName != 0) {
      return checkFirstName;
    }
    if (a.middleName != null && b.middleName != null) {
      final checkMiddleName = a.middleName!.compareTo(b.middleName!);
      if (checkMiddleName != 0) {
        return checkMiddleName;
      }
    } else if (a.middleName != null || b.middleName != null) {
      return a.middleName != null ? 1 : -1;
    }

    // 이름이 완전히 같으면 먼저 만든 순서대로
    return a.id.compareTo(b.id);
  });
}

final allPhone = ContactGroup(
  id: 0,
  permanent: true,
  label: 'All iPhone',
  title: 'iPhone',
  contacts: allContacts.toList(),
);

final friends = ContactGroup(
  id: 1,
  label: 'Friends',
  contacts: [allContacts.elementAt(3)],
);

final work = ContactGroup(id: 2, label: 'Work');

List<ContactGroup> generateSeedData() {
  return [allPhone, friends, work];
}

class ContactGroupsModel {
  ContactGroupsModel() : _listsNotifier = ValueNotifier(generateSeedData());

  final ValueNotifier<List<ContactGroup>> _listsNotifier;

  ValueNotifier<List<ContactGroup>> get listsNotifier => _listsNotifier;

  List<ContactGroup> get lists => _listsNotifier.value;

  ContactGroup findContactList(int id) {
    return lists[id];
  }

  void dispose() {
    _listsNotifier.dispose();
  }
}
```

이 코드에서 눈여겨볼 Dart·Flutter 기법은 다음과 같습니다.

- **팩터리 생성자 + private 이름 있는 생성자**: 공개 `factory ContactGroup(...)`이 연락처를 정렬한 뒤 `ContactGroup._internal(...)`로 실제 객체를 만듭니다. 생성 전에 데이터를 가공할 때 쓰는 패턴입니다.
- **초기화 목록**(`: title = title ?? label, ...`): 생성자 본문 전에 `final` 필드를 초기화합니다.
- **`SplayTreeMap`**: 키가 **정렬된 상태로 유지**되는 맵입니다. 성의 첫 글자를 키로 쓰면 A, B, C… 순서의 섹션을 쉽게 만들 수 있습니다.
- **`ValueNotifier`**: 값 **하나**를 감싸고, `value`가 바뀌면 리스너에게 알리는 간단한 `ChangeNotifier`입니다.

## 5. 데이터를 앱에 연결하기

`lib/main.dart`에서 모델을 전역으로 하나 만듭니다.

```dart
import 'package:flutter/cupertino.dart';

import 'data/contact_group.dart';

final contactGroupsModel = ContactGroupsModel();

void main() {
  runApp(const RolodexApp());
}

// RolodexApp은 그대로 둔다.
```

> **참고** 튜토리얼은 단순화를 위해 모델을 전역 변수로 둡니다. 규모가 큰 앱에서는 의존성 주입이나 `InheritedWidget` 기반 패키지(예: provider)로 전달하는 방식을 고려하세요.

## 핵심 정리

- `CupertinoApp`과 `CupertinoThemeData`로 iOS 스타일 프로젝트를 설정했습니다.
- `Contact`와 `ContactGroup` 모델, 샘플 데이터를 만들었습니다.
- `SplayTreeMap`으로 알파벳순 섹션을, `ValueNotifier`로 그룹 목록의 변경 알림을 준비했습니다.
