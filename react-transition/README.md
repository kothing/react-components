# ReactTransition
A transition is an animation usually used to move content in or out of view.

## Transition
A transition is an animation usually used to move content in or out of view. 

Name|Default|Type|Description
---|---|---|---
animation|fade|```{enum/string}```|Named animation event to used. Must be defined in CSS. **Enums**: <code>browse</code>, <code>browse right</code> <code>'drop'</code>, <code>'fade'</code>, <code>'fade up'</code>, <code>'fade down'</code>, <code>'fade left'</code>, <code>'fade right'</code>, <code>'fly up'</code>, <code>'fly down'</code>, <code>'fly left'</code>, <code>'fly right'</code>, <code>'horizontal flip'</code>, <code>'vertical flip'</code>, <code>'scale'</code>, <code>'slide up'</code>, <code>'slide down'</code>, <code>'slide left'</code>, <code>'slide right'</code>, <code>'swing up'</code>, <code>'swing down'</code>, <code>'swing left'</code>, <code>'swing right'</code>, <code>'zoom'</code>, <code>'jiggle'</code>, <code>'flash'</code>, <code>'shake'</code>, <code>'pulse'</code>, <code>'tada'</code>, <code>'bounce'</code>, <code>'glow'</code>
children|/|```{element}```|Primary content.
directional|/|```{bool}```|Whether it is directional animation event or not. Use it only for custom transitions.
duration|500|```{number/shape/string}```|Duration of the CSS transition animation in milliseconds.
mountOnShow|true|```{bool}```|Wait until the first "enter" transition to mount the component (add it to the DOM).
onComplete|/|```{func}```|Callback on each transition that changes visibility to shown.
onHide|/|```{func}```|Callback on each transition that changes visibility to hidden.
onShow|/|```{func}```|Callback on each transition that changes visibility to shown.
onStart|/|```{func}```|Callback on animation start.
reactKey|/|```{string}```|React's key of the element.
transitionOnMount|false|```{bool}```|Run the enter animation when the component mounts, if it is initially shown.
unmountOnHide|false|```{bool}```|Unmount the component (remove it from the DOM) when it is not shown.
visible|true|```{bool}```|Show the component; triggers the enter or exit animation.

---------------------------

## Transition.Group
A Transition.Group animates children as they mount and unmount.

Name|Default|Type|Description
---|---|---|---
animation|fade|```{enum/string}```|Named animation event to used. Must be defined in CSS. **Enums**: <code>'browse'</code>, <code>'browse right'</code> <code>'drop'</code>, <code>'fade'</code>, <code>'fade up'</code>, <code>'fade down'</code>, <code>'fade left'</code>, <code>'fade right'</code>, <code>'fly up'</code>, <code>'fly down'</code>, <code>'fly left'</code>, <code>'fly right'</code>, <code>'horizontal flip'</code>, <code>'vertical flip'</code>, <code>'scale'</code>, <code>'slide up'</code>, <code>'slide down'</code>, <code>'slide left'</code>, <code>'slide right'</code>, <code>'swing up'</code>, <code>'swing down'</code>, <code>'swing left'</code>, <code>'swing right'</code>, <code>'zoom'</code>, <code>'jiggle'</code>, <code>'flash'</code>, <code>'shake'</code>, <code>'pulse'</code>, <code>'tada'</code>, <code>'bounce'</code>, <code>'glow'</code>
as|Fragment|```{custom}```|An element type to render as (string or function).
children|/|```{node}```|Primary content.
directional|/|```{bool}```|Whether it is directional animation event or not. Use it only for custom transitions.
duration|500|```{number/shape/string}```|Duration of the CSS transition animation in milliseconds.
