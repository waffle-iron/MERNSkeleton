import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider, defineMessages } from 'react-intl';

import Toggle from '../index';

describe('<Toggle />', () =>
{
  const defaultEnMessage = 'someContent';
  const defaultDeMessage = 'someOtherContent';
  const messages = defineMessages({
    en: {
      id: 'boilerplate.containers.LocaleToggle.en',
      defaultMessage: defaultEnMessage,
    },
    de: {
      id: 'boilerplate.containers.LocaleToggle.en',
      defaultMessage: defaultDeMessage,
    },
  });
  const renderedComponent = shallow(
    <IntlProvider locale="en">
      <Toggle values={['en', 'de']} messages={messages} />
    </IntlProvider>
  );

  it('should contain default text', () =>
  {
    expect(renderedComponent.contains(<Toggle values={['en', 'de']} messages={messages} />)).toBe(true);
  });
});
