import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <Spinner size="lg" color="primary" />
    </div>
  );
}