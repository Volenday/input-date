import React, { Component } from 'react';
import moment from 'moment';

// ant design
import Button from 'antd/es/button';
import Popover from 'antd/es/popover';
import DatePicker from 'antd/es/date-picker';

import 'rc-calendar/assets/index.css';
import './styles.css';

export default class InputDate extends Component {
	state = {
		format: 'MMMM DD, YYYY hh:mm A',
		hasChange: false,
		isPopoverVisible: false
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

		return (
			<DatePicker
				showTime={{ format: 'hh:mm A' }}
				allowClear
				disabled={disabled}
				value={moment(value).isValid() ? moment(value) : null}
				onChange={value => {
					onChange(id, value ? value.toISOString() : value);
					this.setState({ hasChange: true });
				}}
				placeholder={`${placeholder || label || id} (${this.getFormat(withTime)})`}
				name={id}
				required={required}
				style={styles}
				format="MMMM DD, YYYY hh:mm A"
				size="large"
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
		const { hasChange } = this.state;
		const { id, action, label = '', required = false, withLabel = false, historyTrack = false } = this.props;

		if (withLabel) {
			if (historyTrack) {
				return (
					<div className="form-group">
						<span class="float-left">
							<label for={id}>{required ? `*${label}` : label}</label>
						</span>
						{hasChange && action !== 'add' && this.renderPopover()}
						<br />
						{this.renderInput()}
					</div>
				);
			}

			return (
				<div className="form-group">
					<label for={id}>{required ? `*${label}` : label}</label>
					<br />
					{this.renderInput()}
				</div>
			);
		} else {
			if (historyTrack) {
				return (
					<div class="form-group">
						{hasChange && action !== 'add' && this.renderPopover()}
						<br />
						{this.renderInput()}
					</div>
				);
			}

			return this.renderInput();
		}

		return null;
	}
}
