import React from 'react'
import Icon from '@ant-design/icons';

// eslint-disable-next-line react/display-name
const CustomIcon = React.forwardRef((props, _) => <Icon component={props.svg} className={props.className}/>)

export default CustomIcon
