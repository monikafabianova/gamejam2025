import type { JSX } from 'react';
import TexturedFBX from './TexturedFBX';

type TreeProps = {
  treeNumber?: number;
} & JSX.IntrinsicElements['group'];

export default function Tree({ treeNumber, ...props }: TreeProps) {
  const treeOptions = [
    'tree_01',
    'tree_02',
    'tree_03',
    'tree_dead',
    'log',
    'stump',
  ];
  const randomIndex = Math.floor(Math.random() * treeOptions.length);
  const treeName =
    treeNumber && treeNumber > 0 && treeNumber < 7
      ? treeOptions[treeNumber - 1]
      : treeOptions[randomIndex];
  const url = `/trees/${treeName}_mesh.fbx`;

  return (
    <TexturedFBX url={url} texture={'/trees/trees_colour.png'} {...props} />
  );
}
