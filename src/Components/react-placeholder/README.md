# React Placeholder
A React component to easily replicate your page with nice placeholders while the content is loading.
You can use a placeholder from the default set, or pass your own!

![image](https://raw.githubusercontent.com/missra-kit/react-component-library/master/react-Placeholder/react-placeholder.png)

```jsx
import ReactPlaceholder from 'components/react-placeholder';
import "components/react-placeholder/reactPlaceholder.css";

React.renderComponent(
  <div>
    <ReactPlaceholder type='media' rows={7} ready={this.state.ready}>
      <MyComponent />
    </ReactPlaceholder>
  </div>,
  document.body);
```

### Props

```jsx
children:             PropTypes.oneOfType([
                        PropTypes.node,
                        PropTypes.element
                      ]).isRequired,
ready:                PropTypes.bool.isRequired,
delay:                PropTypes.number,
firstLaunchOnly:      PropTypes.bool,
showLoadingAnimation: PropTypes.bool,
type:                 PropTypes.oneOf(['text', 'media', 'textRow', 'rect', 'round']),
rows:                 PropTypes.number,
color:                PropTypes.string,
customPlaceholder:    PropTypes.oneOfType([
                        PropTypes.node,
                        PropTypes.element
                      ])
```

### Customization
If the built-in set of placeholders is not enough, you can pass you own through the prop **"customPlaceholder"**

```jsx
<ReactPlaceholder ready={this.state.ready} customPlaceholder={<MyCustomPlaceholder />}>
  <MyComponent />
</ReactPlaceholder>
```

You can also import the built-in placeholders directly. This might be useful to use them to create your own customized placeholder:

```jsx
import {TextBlock, MediaBlock, TextRow, RectShape, RoundShape} from 'react-placeholder/placeholders';

const awesomePlaceholder = (
  <div className='my-awesome-placeholder'>
    <TextBlock color='#E0E0E0' rows={4} />
    <MediaBlock color='#E0E0E0' rows={4} />
    <RectShape color='blue' style={{width: 30, height: 80}}/>
    <RoundShape color='#E0E0E0' style={{ width: 50, height: 50 }} />
    <TextRow color='#E0E0E0' />
  </div>
);

<ReactPlaceholder ready={this.state.ready} customPlaceholder={awesomePlaceholder}>
  <MyComponent />
</ReactPlaceholder>
```

### Type

type='text'
```jsx
<ReactPlaceholder type='text' ready={false} rows={6} color='#E0E0E0'>
  RealComponent
</ReactPlaceholder>
```

type='media'
```jsx
<ReactPlaceholder type='media' ready={false} rows={4}>
  RealComponent
</ReactPlaceholder>
```

type='textRow'
```jsx
<ReactPlaceholder type='textRow' ready={false} color='#E0E0E0'>
  RealComponent
</ReactPlaceholder>
```

type='rect'
```jsx
<ReactPlaceholder type='rect' ready={false} color='#E0E0E0' style={{ width: 50, height: 50 }}>
  RealComponent
</ReactPlaceholder>
```

type='round'
```jsx
<ReactPlaceholder type='round' ready={false} color='#E0E0E0' style={{ width: 50, height: 50 }}>
  RealComponent
</ReactPlaceholder>
```


### Delay
You can pass an optional `delay` prop which specifies the time (in milliseconds) `react-placeholder` should wait before displaying the placeholder element. This is useful if you want to show a placeholder for slower connections while avoiding a brief "flash" on faster connections.

Note that this delay will __not__ affect the initial render, only subsequent "ready" state changes. Setting the `firstLaunchOnly` prop to `true` will also disable this feature.

```jsx
<ReactPlaceholder delay={1000} ready={false} rows={4} color='#E0E0E0'>
  RealComponent
</ReactPlaceholder>
```

### Animation
`react-placeholder` already comes with one default pulse animation to better tell the user that the page is loading.
The animation is defined in a separate CSS file so, in order to enable it, you should import that style in your project like this:

```js
import 'react-placeholder/reactPlaceholder.css';
```
```jsx
<ReactPlaceholder showLoadingAnimation={true} type='media' ready={false} rows={4}>
  RealComponent
</ReactPlaceholder>
```

Once you've done this, you can simply pass the boolean prop `showLoadingAnimation` to tell `ReactPlaceholder` to animate itself:

```jsx
import 'react-placeholder/reactPlaceholder.css';

<ReactPlaceholder showLoadingAnimation ready={this.state.ready} type="media" rows={5}>
  <p>This is a Test.</p>
</ReactPlaceholder>
```


### firstLaunchOnly
```jsx
<ReactPlaceholder firstLaunchOnly={true} ready={false} rows={4} color='#E0E0E0'>
  RealComponent
</ReactPlaceholder>
```


### Style
you can style the placeholder by passing **```className```** or **```style```** or by using the built-in classes:

*"text-block", "media-block", "text-row", "rect-shape", "round-shape".* 

