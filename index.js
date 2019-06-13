import React, { Component } from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import { Pane, Popover, Position } from 'evergreen-ui';

import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import './styles.css';

export default class InputDate extends Component {
	state = {
		format: 'MMMM DD, YYYY hh:mm A'
	};

	getFormat(withTime) {
		const { format } = this.state;
		return withTime ? format : 'MMMM DD, YYYY';
	}

	renderInput() {
		const {
			disabled = false,
			id,
			label = '',
			onChange,
			placeholder = '',
			required = false,
			value = '',
			withTime = false,
			styles = {}
		} = this.props;

		const timePicker = (
			<TimePickerPanel
				format="hh:mm A"
				showSecond={false}
				use12Hours={true}
				defaultValue={moment('00:00:00 am', 'hh:mm:ss A')}
			/>
		);

		const calendar = (
			<Calendar
				style={{ zIndex: 9999 }}
				dateInputPlaceholder={`${placeholder || label || id} (${this.getFormat(withTime)})`}
				formatter={this.getFormat(withTime)}
				timePicker={withTime ? timePicker : null}
				showDateInput={false}
			/>
		);

		return (
			<DatePicker
				disabled={disabled}
				calendar={calendar}
				value={moment(value).isValid() ? moment(value) : null}
				onChange={e => onChange(id, e ? e.toISOString() : e)}>
				{({ value }) => {
					return (
						<input
							placeholder={`${placeholder || label || id} (${this.getFormat(withTime)})`}
							disabled={disabled}
							readOnly
							className="ant-calendar-picker-input ant-input form-control"
							name={id}
							value={value ? value.format(this.getFormat(withTime)) : ''}
							required={required}
							style={styles}
						/>
					);
				}}
			</DatePicker>
		);
	}

	renderPopover = () => {
		const { id, label, required } = this.props;

		return (
			<Popover
				content={
					<Pane
						width={240}
						height={240}
						display="flex"
						alignItems="center"
						flexDirection="column"
						justifyContent="center"
						position={Position.TOP_RIGHT}
					>
						<div class="form-group">
							<label for={id}>{required ? `*${label}` : label}</label>
							{this.renderInput()}
						</div>
					</Pane>
				}
				statelessProps={{ zIndex: 99 }}
			>
				{({ getRef, toggle }) => {
					return (
						<span class="pull-right text-warning" ref={getRef}>
							<i onClick={toggle} style={{ cursor: 'pointer' }} class="fa fa-exclamation-circle" aria-hidden="true"></i>
						</span>
					);
				}}					
			</Popover>
		);
	};

	render() {
		const { id, label = '', required = false, withLabel = false, historyTrack = false } = this.props;

		if (withLabel) {
			if (historyTrack) {
				return (
					<div className="form-group">
						<span class="pull-left"><label for={id}>{required ? `*${label}` : label}</label></span>
						{this.renderPopover()}
						{this.renderInput()}
					</div>
				);
			}
			
			return (
				<div className="form-group">
					<label for={id}>{required ? `*${label}` : label}</label>
					{this.renderInput()}
				</div>
			);
		} else {
			if (historyTrack) {
				return (
					<div class="form-group">
						{this.renderPopover()}
						{this.renderInput()}
					</div>
				);
			}

			return this.renderInput();
		}

		return null;
	}
}
