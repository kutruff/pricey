/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
export * from './theme';

export const flexVertical = css({
    display: 'flex',
    flexDirection: 'column',
});

export const flexGrow = css({
    flex: 1,
});

export const flexCenterChildren = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export const flexGrowBasis1 = css({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 1
});


export const flexGrowAndFlexChildrenVertical = css(flexVertical, flexGrow);