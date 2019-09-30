import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DatePicker, Form } from 'antd';

import './styles.css';

export default class InputDate extends Component {
	state = {
		format: 'MMMM DD, YYYY hh:mm A'
	};

	getFormat(withTime) {
		const { format } = this.state;
		return withTime ? format : 'MMMM DD, YYYY';
	}

	onChangeTimeout = null;
	onChange = async value => {
		const { id, onChange, timezone = 'auto' } = this.props;

		value = value
			? timezone === 'auto'
				? value.format()
				: value
						.utc()
						.tz(timezone)
						.format()
			: value;

		onChange({ target: { name: id, value } }, id, value);
	};

	renderInput() {
		const {
			disabled = false,
			id,
			label = '',
			placeholder = '',
			value = '',
			withTime = false,
			styles = {},
			onOk = null
		} = this.props;

		return (
			<DatePicker
				allowClear
				disabled={disabled}
				format={this.getFormat(withTime)}
				name={id}
				onChange={e => this.onChange(e)}
				onOk={onOk}
				placeholder={`${placeholder || label || id} (${this.getFormat(withTime)})`}
				showTime={withTime ? { format: 'hh:mm A' } : false}
				style={{ width: '100%', ...styles }}
				value={moment(value).isValid() ? moment(value) : null}
			/>
		);
	}

	render() {
		const { error = null, label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			help: error ? error : '',
			label: withLabel ? label : false,
			required,
			validateStatus: error ? 'error' : 'success'
		};

		return <Form.Item {...formItemCommonProps}>{this.renderInput()}</Form.Item>;
	}
}
