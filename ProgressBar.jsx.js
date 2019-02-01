import { number } from 'prop-types';
import styled, { css, keyframes } from 'styled-components';

const slide = keyframes`
  from { transform: scaleX(0) }
  to { transform: scaleX(1) }
`;

export const ProgressBar = styled.div`
  position: relative;
  height: 1em;
  border-radius: 3px;
  font-size: 8px;
  box-sizing: border-box;
  overflow: hidden;

  &::before {
    position: absolute;
    left: 0;
    content: '';
    height: 100%;
    background-color: rgb(0, 82, 204);
    animation: ${slide} 0.3s ease-in;
    animation-fill-mode: backwards;
    transform-origin: 0;
  }

  ${({ percentage }) => {
    const ratio = 100 / percentage;
    if (ratio < 1) {
      return css`
          & {
            background-color: rgb(255, 171, 0);
            &:before {
              width: ${ratio * 100}%;
            }
          }
`;
    }
    return css`
      & {
        background-color: rgb(223, 225, 230);
        &:before {
          width: ${percentage}%;
        }
      }
      `;
  }}
`;

ProgressBar.propTypes = {
  percentage: number,
};
