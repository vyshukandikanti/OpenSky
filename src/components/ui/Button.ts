/**
 * Accessible button element generator helper.
 */
export interface ButtonProps {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel?: string;
  readonly onClick: () => void;
}

export function createAccessibleButton(props: ButtonProps): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = props.id;
  btn.type = 'button';
  btn.textContent = props.label;
  if (props.ariaLabel) {
    btn.setAttribute('aria-label', props.ariaLabel);
  }
  btn.addEventListener('click', props.onClick);
  return btn;
}
