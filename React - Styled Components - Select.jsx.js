import React, { Children } from 'react';
import { string, bool, func, node } from 'prop-types';
import RootClose from 'react-overlays/lib/RootCloseWrapper';
import styled, { css } from 'styled-components';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { Input, Icon } from './Input';

const StyledInput = styled(Input)``;

const SelectContainer = styled.span`
  position: relative;
  display: inline-block;
  cursor: pointer;

  ${StyledInput} {
    cursor: pointer;
  }

  ${Icon} {
      transition: transform 0.2s ease;
  }

  ${({ open }) => open && css`
    ${Icon} {
      transform: rotate(90deg);
    }
    ${StyledInput} {
      border-radius: 3px 3px 0 0;
    }
  `}
`;

const OptionList = styled.div`
  position: absolute;
  width: 100%;
  background-color: #ffffff;
  border-radius: 0 0 3px 3px;
  border: 1px solid rgb(193, 199, 208);
  border-top-width: 0;
  box-sizing: border-box;
  z-index: 2;
`;

export class Select extends React.Component {
  static propTypes = {
    value: string,
    onChange: func.isRequired,
    children: node.isRequired,
  }

  static defaultProps = {
    value: null,
  }

  state = {
    open: false,
  }

  onOpen = () => this.setState({ open: true });

  onClose = () => this.setState({ open: false });

  onChange = value => (e) => {
    e.stopPropagation();
    this.props.onChange(value);
    this.onClose();
  };

  render() {
    const { value, children } = this.props;
    const { open } = this.state;

    let text = '';

    const options = Children.map(children, (element) => {
      const {
        value: optionValue,
        children: optionText,
      } = element.props;

      const selected = optionValue === value;
      if (selected) {
        text = optionText;
      }

      return React.cloneElement(element, { selected, onClick: this.onChange(optionValue) });
    });

    return (
      <RootClose onRootClose={this.onClose}>
        <SelectContainer open={open} onClick={this.onOpen}>
          <StyledInput
            readOnly
            placeholder="Select"
            value={text}
            icon={faCaretDown}
          />
          {
            open &&
            <OptionList>
              {options}
            </OptionList>
          }
        </SelectContainer>
      </RootClose>
    );
  }
}

export const Option = styled.div`
  padding: 7px;

  &:hover {
    background-color: #f1f1f1;
  }

  ${({ selected }) => selected && css`
    background-color: #eaeaea;
  `}
`;

Option.propTypes = {
  selected: bool,
  onClick: func,
  children: node.isRequired,
};

Option.defaultProps = {
  selected: false,
  onClick: null,
};
