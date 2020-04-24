# React Star Ratings

> Customizable react star ratings. SVG stars that show aggregate star ratings to the hundreths decimal point.

## Demo

### [codepen playground of similar project](https://codepen.io/ekeric13/project/full/DkJYpA/)


## Usage

```js
import StarRatings from './react-star-ratings';

class Foo extends Component {
    changeRating( newRating, name ) {
      this.setState({
        rating: newRating
      });
    }

    render() {
      // rating = 2;
      return (
        <StarRatings
          rating={this.state.rating}
          starRatedColor="blue"
          changeRating={this.changeRating}
          numberOfStars={6}
          name='rating'
        />
      );
    }
}


class Bar extends Component {
  render() {
    // aggregateRating = 2.35;
    return (
      <StarRatings
        rating={2.403}
        starDimension="40px"
        starSpacing="15px"
      />
    );
  }
}
```

## API

| Prop | Type | Default | Description | Example |
| ---- | ---- | ------- | ----------- | ------- |
| rating | number | 0 | The user's rating. Number of stars to highlight. | `3` |
| numberOfStars | number | 5 | The max number of stars to choose from or to display | `6` |
| changeRating | function | ()=>{} | Callback that will be passed the new rating a user selects | `const setNewRating = (rating) => this.props.dispatch( fooActions.setRating(rating) )` |
| starRatedColor | string | 'rgb(109, 122, 130)' | Color of stars that the user has rated | `black` |
| starEmptyColor | string | 'rgb(203, 211, 227)' | Color of stars that the use hasn't rated | `grey` |
| starHoverColor | string | 'rgb(230, 67, 47)' | Color of star when hovering over it in selection mode | `yellow` |
| starDimension | string | '50px' | The width and height of the star | `15px` |
| starSpacing | string | '7px' | The spacing between the stars | `0` |
| gradientPathName | string | '' | gradientPathname needed if app's path is not at the root | `/app/` |
| ignoreInlineStyles | boolean | false | ignore all the inline styles and write your own css using the provided classes | `true` | 
| svgIconPath | string | 'm25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z' | Set a path that describes the svg shape | 'm25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z' |
| svgIconViewBox | string | '0 0 51 48' | Set the view box for a custom svg path you might have | '0 0 51 48' |
| name | string | '' | Component's unique identification. Can be used when more than one star rating components are used | 'rating' |


## Browser Support

Supports Chrome, firefox, safari, edge, and ie 9+.
The star is SVG, so this library fails for any browser that doesn't support svg.
