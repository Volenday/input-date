import React, { Component, Fragment } from 'react';
import moment from 'moment-timezone';
import validate from 'validate.js';
import { DatePicker, Form } from 'antd';

import './styles.css';

export default class InputDate extends Component {
	state = {
		errors: [],
		format: 'MMMM DD, YYYY hh:mm A'
	};

	getFormat(withTime) {
		const { format } = this.state;
		return withTime ? format : 'MMMM DD, YYYY';
	}

	onChange = async value => {
		const { id, onChange, onValidate, timezone = 'auto' } = this.props;

		value = value
			? timezone === 'auto'
				? value.format()
				: value
						.utc()
						.tz(timezone)
						.format()
			: value;

		onChange({ target: { name: id, value } }, id, value);
		const errors = this.validate(value);
		await this.setState({ errors });
		if (onValidate) onValidate(id, errors);
	};

	validate = value => {
		const { id, required = false } = this.props;

		validate.extend(validate.validators.datetime, {
			parse: value => +moment.utc(value),
			format: (value, options) => {
				const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
				return moment.utc(value).format(format);
			}
		});

		const format = 'YYYY-MM-DD hh:mm:ss';
		value = moment(value).format(format);
		const constraints = {
			[id]: {
				datetime: true,
				presence: { allowEmpty: !required }
			}
		};

		const errors = validate({ [id]: value }, constraints);
		return validate.isEmpty(value) && !required ? [] : errors ? errors[id] : [];
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
		const { errors } = this.state;
		const { label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			help: errors.length != 0 ? errors[0] : '',
			label,
			required,
			validateStatus: errors.length != 0 ? 'error' : 'success'
		};

		if (withLabel) {
			return <Form.Item {...formItemCommonProps}>{this.renderInput()}</Form.Item>;
		}

		return <Fragment>{this.renderInput()}</Fragment>;
	}
}
