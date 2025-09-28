# The frontend
## z-index area map
| Component          | z-index area |
|--------------------|--------------|
| App.tsx            | 1            |
| window.tsx         | 2-11         |
| page.tsx           | 50           |
| ToggleToolsBar.tsx | 100          |
| messageBox.tsx     | 150          |
| anyPageView        | 200-1200     |
| OverlayWindow.tsx  | 1300-1400    |

- z-index - CSS | MDN   
https://developer.mozilla.org/en-US/docs/Web/CSS/z-index (2025年9月27日) 

## ovelayWindow
### z-index management
- clicked window -> the highest z-index will be assigned.
- inactive window -> as other window clicked, the new z-index is "z-index - 1".

### window store
 overlayWindows have to register itself into the store for z-index management.

