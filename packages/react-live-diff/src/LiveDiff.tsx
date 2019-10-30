import React, {ReactElement} from 'react';
import useLiveDiff from './useLiveDiff';
import {Patch, RenderApi} from './types';

type Props = {
  initialValue?: string;
  patches: Array<Patch>;
  render: (api: RenderApi) => ReactElement;
};

const LiveDiff = ({initialValue = '', patches, render}: Props) => {
  const api = useLiveDiff(initialValue, patches);
  return render(api);
};

export default LiveDiff;
