import React from 'react';

import Ul from './Ul';
import Wrapper from './Wrapper';

function List(props)
{
  const ComponentToRender = props.component;
  let content = (<div></div>);

  // If we have items, render them
  if(props.items)
{
    content = props.items.map((item, index) => (
      <ComponentToRender key={`item-${item.id}`} data-index={index} item={item} />
    ));
  }
  else
{
    // Otherwise render a single component
    content = (<ComponentToRender />);
  }

  return (
    <Wrapper>
      <Ul>
        {content}
      </Ul>
    </Wrapper>
  );
}

List.defaultProps = {
  items: [],
};

List.propTypes = {
  component: React.PropTypes.func.isRequired,
  items: React.PropTypes.array,
};

export default List;
