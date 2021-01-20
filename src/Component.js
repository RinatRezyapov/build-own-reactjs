export function instantiateComponent(element) {
  const wrapperInstance = new element.type(element.props);
  wrapperInstance._construct(element);

  return wrapperInstance;
}
