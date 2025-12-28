export default function ActionButton({
  label,
  onAction
}: {
  label: string,
  onAction: () => void
}) {
  return <button
    className="game-button"
    onClick={() => {
      console.log(`Running computation: ${label}`);
      onAction();
    }}
  >
    {label}
  </button>;
}
