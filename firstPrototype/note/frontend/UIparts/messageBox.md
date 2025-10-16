# messageBox
## Role
 Show message box.

## Sample image


## Usage
 This is the example code of `src\modules\pages\markdown.tsx`.

```tsx
...
import { useMessageBoxStore, type aMessageBox } from "../MainUI/UIparts/messageBox";
...
    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)
...
            const message:aMessageBox = {
                title   : "Markdown Page",
                type    : "error",
                UUID    : messageBoxUUID.current,
                message : "Invalid data is received. The backend error.",
            }
            showMessageBox(message)
...
```




