# 11th_UMC_Web_C
숙명여대 11기 UMC Web C 스터디

## 🌿 Branch Convention

각 팀원은 본인의 깃허브 아이디를 기준으로 FE와 BE 각각 개인 브랜치를 생성합니다.


### 브랜치명 예시

본인의 메인 브랜치
- `daeunkim701/FE/main`
- `daeunkim701/BE/main`

본인의 서브 브랜치
- `daeunkim701/FE/week02`
- `daeunkim701/FE/week03`
- `daeunkim701/BE/week02`
- `daeunkim701/BE/week03`

## 📌코드 push 순서

매주 본인의 메인 브랜치로부터 서브 브랜치 FE와 BE를 각각 생성하시고 코드 작성 후

🖥️ git add 자신이 수정한 파일명

🖥️ git commit -m “커밋 메시지”

🖥️ git push origin 본인이 만든 해당 주차 서브 브랜치명

push를 완료했다면 스터디 repository에서 pull request를 진행합니다.

(자신의 브랜치에 push 후 github 페이지 들어오면 뜰 거예요!)

PR(Pull Request)시 메세지 제목은 다음과 같이 "[이름/닉네임] ㅇ주차 FE(BE) 정리 내용 제출" 이라고 적은 후 create pull request 버튼을 눌러주세요.

## ⭐ 매주 PR 생성하기

PR : base: [본인의 메인 브랜치] <- compare: [본인의 서브 브랜치]

예시 ⬇️

`daeunkim701/FE/main` <- `daeunkim701/FE/week02`
<br>
`daeunkim701/BE/main` <- `daeunkim701/BE/week02`

이런 식으로 PR을 생성하시면 됩니다! 매주 FE & BE 총 2개의 PR을 생성하시면 되는 겁니다. (워크북 내용 중 코드 작성이 없는 주차는 코드 push 안 하셔도 됩니다)

```text
PR에 Comment를 달며 코드 리뷰를 해주고, 리뷰가 끝나면 본인의 메인 브랜치로 Merge 해주시면 됩니다.
Merge된 브랜치는 삭제해주세요!
```

## 📝 Commit Message Convention

커밋 메시지는 아래의 형식을 따릅니다.

```text
<type>: <description>
```

### Commit Type

| Type       | Description                   |
| ---------- | ----------------------------- |
| `feat`     | 새로운 기능 추가                     |
| `fix`      | 버그 수정                         |
| `docs`     | 문서 수정                         |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 코드 스타일 변경, UI 및 CSS 변경   |
| `refactor` | 기능 변경 없이 Production Code 리팩토링 |
| `chore`    | 자잘한 수정 및 빌드 업데이트              |
| `remove`   | 파일 또는 폴더 삭제                   |

### Commit Message Examples

```text
feat: 로그인 기능 구현
fix: 로그인 버튼 클릭 오류 수정
docs: README 작성
style: 코드 포맷팅
refactor: 로그인 로직 리팩토링
chore: 불필요한 파일 정리
remove: 사용하지 않는 파일 삭제
```


❤️ 본인의 폴더안에 있는 README.md 파일은 자유롭게 사용해주세요🙂

‼️ 본인의 폴더와 동일한 위치에 있는 README.md 파일은 🚫절대 수정🚫하지 말아주세요

‼️ 본인의 브랜치가 아닌 다른 브랜치에서는 절대 작업하지 말아주세요

❤️ 깃을 사용하며 오류가 나거나 진행이 안되더라도 혼자 스스로 구글링 해보며 해결해보세요!

❤️ 깃 사용법 참고) https://umc-smwu.notion.site/Git-2aea3e9a04724a08881b8e61e306e5b1
