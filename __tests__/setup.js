const Adapter = require("enzyme-adapter-react-16");

global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null;
  }

  unobserve() {
    return null;
  }
};

const mutationObserverMock = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();

  this.trigger = (mockedMutationsList) => {
    callback(mockedMutationsList, this);
  };
});
global.MutationObserver = mutationObserverMock;

jest.mock("react-lottie", () => "lottie");

require("enzyme").configure({ adapter: new Adapter() });
