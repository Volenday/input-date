import React, { Component } from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';

import 'rc-calendar/assets/index.css';

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

	render() {
		const { id, label = '', required = false, withLabel = false } = this.props;

		if (withLabel) {
			return (
				<div className="form-group">
					<label for={id}>{required ? `*${label}` : label}</label>
					{this.renderInput()}
				</div>
			);
		} else {
			return this.renderInput();
		}

		return null;
	}
}
