/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `config/intl/translations`)
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';

import { makeSelectLocale } from './selectors';

export class LanguageProvider extends React.PureComponent
{ // eslint-disable-line react/prefer-stateless-function
  render()
{
    return (
      <IntlProvider locale={this.props.locale} key={this.props.locale} messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

LanguageProvider.defaultProps = {
  locale: 'en',
};

LanguageProvider.propTypes = {
  locale: React.PropTypes.string,
  messages: React.PropTypes.object.isRequired,
  children: React.PropTypes.element.isRequired,
};

const mapStateToProps = createSelector(
  makeSelectLocale(),
  (locale) => ({ locale })
);

export default connect(mapStateToProps)(LanguageProvider);
