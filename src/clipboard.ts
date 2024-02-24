export const copyToClipboard = (text: string) => {
  if (!copyViaWriteText(text) && !copyViaExecCommand(text)) {
    console.error('Could not copy to clipboard')
  }
}

const copyViaWriteText = (text: string) :boolean => {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch(err) {
    console.info('Failed to copy via writeText: ', err);
    return false
  }
}

const copyViaExecCommand = (text: string) :boolean =>
  withSelectedText(text, () => document.execCommand('copy'))

const withSelectedText = (text: string, fn: () => boolean) => {
  const input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();

  const result = fn();
  input.remove();
  return result;
}
