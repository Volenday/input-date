import React, { Component } from 'react';
import moment from 'moment-timezone';
import validate from 'validate.js';
import { Button, DatePicker, Form, Popover } from 'antd';

import 'rc-calendar/assets/index.css';
import './styles.css';

export default class InputDate extends Component {
	state = {
		errors: [],
		format: 'MMMM DD, YYYY hh:mm A',
		hasChange: false,
		isPopoverVisible: false
	};

	getFormat(withTime) {
		const { format } = this.state;
		return withTime ? format : 'MMMM DD, YYYY';
	}

	onChange = async value => {
		const { action, id, onChange, onValidate, timezone = 'auto' } = this.props;

		value = value
			? timezone === 'auto'
				? value.format()
				: value
						.utc()
						.tz(timezone)
						.format()
			: value;

		onChange(id, value);
		const errors = this.validate(value);
		await this.setState({ errors, hasChange: action === 'add' ? false : true });
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
		return errors ? errors[id] : [];
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
				style={styles}
				value={moment(value).isValid() ? moment(value) : null}
			/>
		);
	}

	handlePopoverVisible = visible => {
		this.setState({ isPopoverVisible: visible });
	};

	renderPopover = () => {
		const { isPopoverVisible } = this.state;
		const { id, label, required } = this.props;

		return (
			<Popover
				content={
					<div class="form-group">
						<label for={id}>{required ? `*${label}` : label}</label>
						{this.renderInput()}
					</div>
				}
				trigger="click"
				title="History Track"
				visible={isPopoverVisible}
				onVisibleChange={this.handlePopoverVisible}>
				<span class="float-right">
					<Button
						type="link"
						shape="circle-outline"
						icon="warning"
						size="small"
						style={{ color: '#ffc107' }}
					/>
				</span>
			</Popover>
		);
	};

	render() {
		const { errors, hasChange } = this.state;
		const { action, label = '', required = false, withLabel = false, historyTrack = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			help: errors.length != 0 ? errors[0] : '',
			label: withLabel ? label : false,
			required,
			validateStatus: errors.length != 0 ? 'error' : 'success'
		};

		return (
			<Form.Item {...formItemCommonProps}>
				{historyTrack && hasChange && action !== 'add' && this.renderPopover()}
				{this.renderInput()}
			</Form.Item>
		);
	}
}
