import React from 'react';
import { mountSmart, shallowSmart } from '../../../../__tests__/testsHelper';
import Layout from "../Layout";

describe('Layout', () => {
  it('renders without crashing', () => {
    const component = shallowSmart(<Layout/>);
    expect(component).toMatchSnapshot();
  });
  it('should mount and have length 1 with 1 country', () => {
    const component = mountSmart(<Layout/>);
    expect(component.find('Main')).toHaveLength(1);
  });
});
