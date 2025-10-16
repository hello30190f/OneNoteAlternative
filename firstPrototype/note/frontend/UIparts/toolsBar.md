# toolsBar
## Role
 `toolsBar` is toggler of `OverlayWindow`. `toolsBar` does not intended to be used without `OverlayWindow`.

## Sample image


## Usage
 This is the example code of `src\modules\tools\notebookAndPages\selector.tsx`.

```tsx
...
import { OverlayWindow, type OverlayWindowArgs } from "../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../../MainUI/UIparts/ToggleToolsBar/StartButton";
...
    const toolbarAddTool = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
...
    // For toolsBar --------------------------
    // For toolsBar --------------------------
    const toggleable:toggleable = {
        name: "Selector",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        setVisibility: setVisible,
        visibility:visible
    }
    // For toolsBar --------------------------
    // For toolsBar --------------------------

    // For OverlayWindow ---------------------
    // For OverlayWindow ---------------------
    let windowArg:OverlayWindowArgs = {
        title: "Selector",
        toggleable: toggleable,
        visible: visible,
        setVisible: setVisible,
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
    } 
    // For OverlayWindow ---------------------
    // For OverlayWindow ---------------------

    // For toolsBar --------------------------
    // For toolsBar --------------------------
    // register toolsbar button to toggle OverlayWindow.
    useEffect(() => {
        toolbarAddTool("notebooksAndPages",toggleable)

        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])
    // For toolsBar --------------------------
    // For toolsBar --------------------------
...
    // For OverlayWindow ---------------------
    // For OverlayWindow ---------------------
    if (index == null) {
        return (
            <OverlayWindow arg={windowArg}>
                // anything whatever you want can be here.
                <SelectorOutline>
                    <ShowError message="Unable to show this index." />
                </SelectorOutline>
            </OverlayWindow>
        );
    } else {
        return (
            <OverlayWindow arg={windowArg}>
                // anything whatever you want can be here.
                <SelectorOutline>
                    <CreateList index={index} />
                </SelectorOutline>
            </OverlayWindow>
        );
    }
    // For OverlayWindow ---------------------
    // For OverlayWindow ---------------------
```


