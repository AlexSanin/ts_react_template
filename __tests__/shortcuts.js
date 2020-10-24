import { shallowSmart, mountSmart, mockStore } from "__tests__/testsHelper";
import React from "react";
import { throwError } from "redux-saga-test-plan/providers";
import { expectSaga, testSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import _ from "lodash";

export const getMountWrapper = (
  component,
  { props = {}, store } = {},
  debug
) => {
  const mockedStore = store && mockStore(store);
  const wrapper = mountSmart(
    React.createElement(component, props),
    mockedStore
  ).find(component);
  // eslint-disable-next-line no-console
  if (debug) console.log(wrapper.debug());
  return wrapper;
};

export const getShallowWrapper = (component, { props = {} } = {}, debug) => {
  let wrapper = shallowSmart(React.createElement(component, props));
  if (wrapper.find("IntlProvider")) wrapper = wrapper.dive();
  // eslint-disable-next-line no-console
  if (debug) console.log(wrapper.debug());
  return wrapper;
};

export const matchSnapshot = (...args) => {
  const wrapper = getShallowWrapper(...args);
  expect(wrapper).toMatchSnapshot();
};

export const find = (...args) => (selector, position = 0) => (expected) => {
  const wrapper = getMountWrapper(...args);
  expect(wrapper.find(selector).at(position)).toHaveLength(expected);
};

export const findAll = (...args) => (selector) => (expected) => {
  const wrapper = getMountWrapper(...args);
  expect(wrapper.find(selector)).toHaveLength(expected);
};

export const sagasTests = (api, actions) => (
  saga,
  payload,
  returnedValue,
  { success, error } = {},
  {
    successName,
    errorName,
    requestName,
    noError,
    noActions,
    errorProvides = [],
    successProvides = [],
    requestArgs,
  } = {}
) => {
  const name = saga.name;
  describe(name, () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    const data = { payload, resolve, reject };
    const args = requestArgs || payload;
    it("should put SUCCESS", () => {
      let expected = expectSaga(saga, data).provide([
        ...successProvides,
        [
          matchers.call([api, api[requestName || name]], ..._.castArray(args)),
          returnedValue,
        ],
        [matchers.call.fn(resolve)],
      ]);
      if (!noActions)
        expected = expected.put(
          actions[successName || `${name}Success`](success)
        );
      return expected.run();
    });
    if (!noError) {
      it("should put ERROR", () => {
        let expected = expectSaga(saga, data).provide([
          ...errorProvides,
          [
            matchers.call(
              [api, api[requestName || name]],
              ..._.castArray(args)
            ),
            throwError(new Error("error")),
          ],
        ]);
        if (!noActions)
          expected = expected.put(actions[errorName || `${name}Error`](error));
        return expected.call(reject, new Error("error")).run();
      });
    }
  });
};

export const watchersTests = (data, mainWatchers) => {
  it("should watchers", () => {
    let begin = testSaga(mainWatchers);
    _.each(data, ([action, saga]) => {
      begin = begin.next().takeEveryEffect(action, saga);
    });
    begin.finish().isDone();
  });
};
