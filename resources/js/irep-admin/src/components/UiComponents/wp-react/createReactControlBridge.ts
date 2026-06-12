type BridgeProps = {
  [key: string]: unknown;
};

export const createReactControlBridge = <T extends BridgeProps>(props: T): T => {
  return props;
};
