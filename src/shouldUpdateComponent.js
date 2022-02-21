export default function shouldUpdateComponent(prevElement, nextElement) {
  let prevType = typeof prevElement;
  let nextType = typeof nextElement;

  if (prevType === 'string') {
    return nextType === 'string';
  }

  return prevElement.type === nextElement.type;
}
