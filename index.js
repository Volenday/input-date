import React from 'react';
import moment from 'moment-timezone';
import { DatePicker, Form, Skeleton } from 'antd';

const browser = typeof window !== 'undefined' ? true : false;

if (browser) require('./styles.css');

export default ({
	className = '',
	disabled = false,
	disabledDate = () => {},
	error = null,
	extra = null,
	id,
	inlineError = true,
	label = '',
	onChange,
	onOk = null,
	placeholder = '',
	required = false,
	styles = {},
	timezone = 'auto',
	value = '',
	withLabel = false,
	withTime = false
}) => {
	if (timezone !== 'auto' || timezone !== 'off') moment.tz.setDefault(timezone);

	const format = 'MMMM DD, YYYY hh:mm A';
	const getFormat = withTime => (withTime ? format : 'MMMM DD, YYYY');

	const handleChange = async value => {
		value = value ? (timezone === 'off' ? moment(value).format('YYYY-MM-DD') : value.format()) : value;
		onChange({ target: { name: id, value } }, id, value);
	};

	const renderInput = () => {
		return (
			<div id="datePickerContainer">
				<DatePicker
					getPopupContainer={trigger => trigger?.parentNode || document.body}
					className={className}
					disabled={disabled}
					disabledDate={disabledDate}
					format={getFormat(withTime)}
					name={id}
					onChange={handleChange}
					onOk={onOk}
					placeholder={`${placeholder || label || id} (${getFormat(withTime)})`}
					showTime={withTime ? { format: 'hh:mm A' } : false}
					style={{ width: '100%', ...styles }}
					value={moment(value).isValid() ? moment(value) : null}
				/>
			</div>
		);
	};

	let formItemCommonProps = {
		colon: false,
		label: withLabel ? (
			<>
				<div style={{ float: 'right' }}>{extra}</div> <span class="label">{label}</span>
			</>
		) : (
			false
		),
		required,
		validateStatus: error ? 'error' : 'success'
	};
	if (inlineError) formItemCommonProps = { ...formItemCommonProps, help: error ? error : '' };

	return (
		<Form.Item {...formItemCommonProps}>
			{browser ? renderInput() : <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />}
		</Form.Item>
	);
};
