import { shallow, mount } from "enzyme";
import { IntlProvider, RawIntlProvider, createIntl } from "react-intl";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
//import { setCookie } from "nookies";
import { render, waitForElement } from "@testing-library/react";
import { theme } from "../src/styles/styledComponents/theme";
import { ThemeProvider } from "styled-components";
import i18nConfig from "../locales";

const intl = createIntl({ locale: "en", messages: i18nConfig.en.messages });

export const shallowSmart = (component, store) => {
  const core = store ? (
    <Provider store={store}>{component}</Provider>
  ) : (
    component
  );
  return shallow(core, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: "en",
      defaultLocale: "en",
      messages: i18nConfig.en.messages,
    },
  });
};

export const mountSmart = (component, store) => {
  const core = store ? (
    <ThemeProvider theme={theme.lightTheme}>
      <Provider store={store}>{component}</Provider>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme.lightTheme}>{component}</ThemeProvider>
  );
  return mount(core, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: "en",
      defaultLocale: "en",
      messages: i18nConfig.en.messages,
    },
  });
};

const find = (selector, component) => {
  const { container } = component;
  return container.querySelector(selector);
};

//const waitFind = async (selector, component) => {
//  const { container } = component;
//  return waitForElement(() => container.querySelector(selector), { container });
//};

export const renderSmart = (component, store) => {
  // eslint-disable-next-line no-console
  console.error = jest.fn();
  const core = <RawIntlProvider intl={intl}>{component}</RawIntlProvider>;
  const renderedComponent = !store ?
    render(core) :
    render(<Provider store={store}>{core}</Provider>);
  return {
    ...renderedComponent,
    ...renderHelpers(renderedComponent),
  };
};

export const rerenderSmart = (component, store, rerender) => {
  const core = <RawIntlProvider intl={intl}>{component}</RawIntlProvider>;
  const renderedComponent = !store ?
    rerender(core) :
    rerender(<Provider store={store}>{core}</Provider>);
  return {
    ...renderedComponent,
    ...renderHelpers(renderedComponent),
  };
};

//export const checkDispatchedActions = (store, actions) => {
//  const actionsInStore = store.getActions().map((action) => action.type);
//  return _.isEqual(actionsInStore.sort(), actions.sort());
//};

const renderHelpers = (component) => ({
  find: (selector) => find(selector, component),
  waitFind: async (selector) => waitFind(selector, component),
  rerenderSmart: (newComponent, store) =>
    rerenderSmart(newComponent, store, component.rerender),
});

//export const doAuthOnClientSide = () => {
//  process.browser = true;
//  setCookie({}, "auth-headers", token);
//};

export const mockStore = configureStore();
