import React from 'react';
import { number, string, func } from 'prop-types';
import { Calendar } from 'react-date-range';
import RootClose from 'react-overlays/lib/RootCloseWrapper';
import styled from 'styled-components';
import moment from 'moment';

import { Input, InputElement } from './Input';

const formatDateInpit = date => moment(date).format('DD.MM.YYYY');

const Container = styled.span`
  position: relative;
  outline: none;
  width: 200px;
  text-align: center;
  translate: box-shadow 0.2s ease;
  cursor: pointer;
`;

const CalendarPopup = styled.div`
  position: absolute;
  left: 0;
  top: 30px;
  border-radius: 3px;
  box-shadow: rgba(0,0,0,0.1) 0px 0px 0px 1px;
  overflow: hidden;
  z-index: 2;
`;

const StyledInput = styled(Input)`
  /* pointer-events: none; */

  ${InputElement} {
    text-align: center;
  }
`;

export class DatePicker extends React.Component {
  static propTypes = {
    value: number,
    onChange: func.isRequired,
    className: string,
  }

  static defaultProps = {
    value: null,
    className: null,
  }

  state = {
    opened: false,
  }

  onOpen = () => this.setState({ opened: true });

  onRootClose = () => this.setState({ opened: false })

  onChange = (date) => {
    this.props.onChange(date.valueOf());
    this.onRootClose();
  }

  stopPropagation = e => e.stopPropagation();

  render() {
    const { value, className } = this.props;
    const { opened } = this.state;

    return (
      <RootClose onRootClose={this.onRootClose}>
        <Container onClick={this.onOpen} className={className}>
          <StyledInput
            placeholder="Select date"
            value={value ? formatDateInpit(value) : ''}
            readOnly
          />
          {
            opened &&
            <CalendarPopup onClick={this.stopPropagation}>
              <Calendar
                date={value ? moment(value) : null}
                onChange={this.onChange}
              />
            </CalendarPopup>
          }
        </Container>
      </RootClose>
    );
  }
}