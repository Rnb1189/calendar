import React from "react";
import PropTypes from "prop-types";
import KeyCode from "rc-util/lib/KeyCode";
import { polyfill } from "react-lifecycles-compat";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarFooter from "./calendar/CalendarFooter";
import {
   calendarMixinWrapper,
   calendarMixinPropTypes,
   calendarMixinDefaultProps
} from "./mixin/CalendarMixin";
import { commonMixinWrapper, propType, defaultProp } from "./mixin/CommonMixin";
import moment from "moment"; //import moment from "./jalali/jalali-moment";

class MonthCalendar extends React.Component {
   static propTypes = {
      //NEw:
      isRtl: PropTypes.bool,
      ...calendarMixinPropTypes,
      ...propType,
      monthCellRender: PropTypes.func,
      value: PropTypes.object,
      defaultValue: PropTypes.object,
      selectedValue: PropTypes.object,
      defaultSelectedValue: PropTypes.object,
      disabledDate: PropTypes.func
   };

   static defaultProps = Object.assign(
      {},
      //NEw:
      { isRtl: false },
      defaultProp,
      calendarMixinDefaultProps
   );

   constructor(props) {
      super(props);

      this.state = {
         mode: "month",
         value: props.value || props.defaultValue || moment(),
         selectedValue: props.selectedValue || props.defaultSelectedValue
      };
   }

   onKeyDown = event => {
      let keyCode = event.keyCode;
      const ctrlKey = event.ctrlKey || event.metaKey;
      const stateValue = this.state.value;
      const { disabledDate } = this.props;
      let value = stateValue;

      //NEw
      if (this.props.isRtl) {
         if (keyCode === KeyCode.LEFT) keyCode = KeyCode.RIGHT;
         else if (keyCode === KeyCode.RIGHT) keyCode = KeyCode.LEFT;
      }

      switch (keyCode) {
         case KeyCode.DOWN:
            value = stateValue.clone();
            value.add(3, "months");
            break;
         case KeyCode.UP:
            value = stateValue.clone();
            value.add(-3, "months");
            break;
         case KeyCode.LEFT:
            value = stateValue.clone();
            if (ctrlKey) {
               value.add(-1, "years");
            } else {
               value.add(-1, "months");
            }
            break;
         case KeyCode.RIGHT:
            value = stateValue.clone();
            if (ctrlKey) {
               value.add(1, "years");
            } else {
               value.add(1, "months");
            }
            break;
         case KeyCode.ENTER:
            if (!disabledDate || !disabledDate(stateValue)) {
               this.onSelect(stateValue);
            }
            event.preventDefault();
            return 1;
         default:
            return undefined;
      }
      if (value !== stateValue) {
         this.setValue(value);
         event.preventDefault();
         return 1;
      }
   };

   handlePanelChange = (_, mode) => {
      if (mode !== "date") {
         this.setState({ mode });
      }
   };

   render() {
      const { props, state } = this;
      const { mode, value } = state;
      //NEw:
      const rtlClass = this.props.isRtl ? "a-rtl" : "a-ltr";

      const children = (
         //NEw:
         // <div className={`${props.prefixCls}-month-calendar-content`}>
         <div
            className={`${props.prefixCls}-month-calendar-content ${rtlClass}`}
         >
            <div className={`${props.prefixCls}-month-header-wrap`}>
               <CalendarHeader
                  isRtl={this.props.isRtl}
                  prefixCls={props.prefixCls}
                  mode={mode}
                  value={value}
                  locale={props.locale}
                  disabledMonth={props.disabledDate}
                  monthCellRender={props.monthCellRender}
                  monthCellContentRender={props.monthCellContentRender}
                  onMonthSelect={this.onSelect}
                  onValueChange={this.setValue}
                  onPanelChange={this.handlePanelChange}
               />
            </div>
            <CalendarFooter
               isRtl={this.props.isRtl}
               prefixCls={props.prefixCls}
               renderFooter={props.renderFooter}
            />
         </div>
      );
      return this.renderRoot({
         //NEw:
         // className: `${props.prefixCls}-month-calendar`,
         className: `${props.prefixCls}-month-calendar ${rtlClass}`,
         children
      });
   }
}

export default polyfill(
   calendarMixinWrapper(commonMixinWrapper(MonthCalendar))
);
