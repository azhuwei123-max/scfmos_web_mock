import { Icon } from '@/components/Icon'
import { ElButton, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElIcon, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import { datePickerShortcuts } from '@/utils/dateUtil.ts'

export default function useDynamicComp(props, emit) {
  const inputChange = () => {
    emit('inputChange', props.formInfo)
  }
  
  const selectChange = () => {
    emit('selectChange', props.formInfo)
  }

  const selectInputClick = () => {
    emit('selectInputClick', props.formInfo)
  }

  const inputComp = () => {
    return h(ElInput, {
      class: '!w-1/1',
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      maxlength: props.formInfo['collimit'],
      showWordLimit: true,
      clearable: true,
      iscolrequired: props.formInfo['iscolrequired'],
      onInput: inputChange
    })
  }

  const textareaComp = () => {
    return h(ElInput, {
      class: '!w-1/1',
      type: 'textarea',
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      maxlength: props.formInfo['collimit'],
      showWordLimit: true,
      autosize: { minRows: 3, maxRows: 10 },
      clearable: true,
      resize: 'none',
      iscolrequired: props.formInfo['iscolrequired'],
      ...(props.formInfo['componentsProps'] ? props.formInfo['componentsProps'] : {})
    })
  }

  const numberComp = () => {
    return h(ElInputNumber, {
      style: 'flex: unset; width: 200px',
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      max: props.formInfo['colmaxnum'] || Number.MAX_SAFE_INTEGER,
      min: props.formInfo['colminnum'],
      precision: (props.formInfo['precision'] || props.formInfo['precision'] === 0) ? props.formInfo['precision'] : 2,
      controls: false,
      clearable: true,
      iscolrequired: props.formInfo['iscolrequired']
    })
  }

  const radioComp = () => {
    return h(ElRadioGroup, {
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      iscolrequired: props.formInfo['iscolrequired'],
      onChange: selectChange,
    }, {
      default: () => [
        props.dictList[props.formInfo['coldictkey']]?.map(v =>
          h(ElRadio, {
            key: v.itemNo || v.value,
            label: v.itemNo || v.value,
            disabled: v.disabled
          }, v.itemName || v.label)
        )
      ]
    })
  }

  const checkboxComp = () => {
    return h(ElCheckboxGroup, {
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      iscolrequired: props.formInfo['iscolrequired'],
      onChange: selectChange,
    }, {
      default: () => [
        props.dictList[props.formInfo['coldictkey']]?.map(v =>
          h(ElCheckbox, {
            key: v.itemNo || v.value,
            label: v.itemNo || v.value,
            disabled: v.disabled
          }, v.itemName || v.label)
        )
      ]
    })
  }

  const selectComp = () => {
    return h(ElSelect, {
      class: '!w-1/1',
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      clearable: true,
      iscolrequired: props.formInfo['iscolrequired'],
      onChange: selectChange,
    }, {
      default: () => [
        props.dictList[props.formInfo['coldictkey']]?.map(v =>
          h(ElOption, {
            key: v.itemNo || v.value,
            label: v.itemName || v.label,
            value: v.itemNo || v.value,
            disabled: v.disabled
          })
        )
      ]
    })
  }

  const dateComp = () => {
    return h(ElDatePicker, {
      style: 'flex: unset; width: 200px',
      type: 'date',
      modelValue: props.formData[props.formInfo['colname']],
      'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
      disabled: props.formInfo['iscolreadonly'],
      valueFormat: 'YYYY/MM/DD',
      clearable: true,
      placeholder: '选择日期',
      shortcuts: datePickerShortcuts,
      iscolrequired: props.formInfo['iscolrequired'],
      onChange: selectChange,
    })
  }

  const selectInput = () => {
    return h('div', {
      class: 'readonly-clear-wrapper',
      style: { position: 'relative' }
    }, [
      h(ElInput, {
        class: '!w-1/1',
        modelValue: props.formData[props.formInfo['colname']],
        'onUpdate:modelValue': (v) => (props.formData[props.formInfo['colname']] = v),
        readonly: true,
        iscolrequired: props.formInfo['iscolrequired'],
        onClick: selectInputClick,
      }, {
        suffix: () => props.formData[props.formInfo['colname']] ? h(ElIcon, {
          style: {
            cursor: 'pointer'
          },
          class: 'clear-icon',
          onClick: (e) => {
            e.stopPropagation();
            props.formData[props.formInfo['colname']] = ''
            emit('popConfirm', props.formInfo['colname'], {})
          }
        }, {
          default: () => h(CircleClose)
        }) : null,
        append: () => h(ElButton, {
          onClick: selectInputClick,
        }, {
          default: () => h(Icon, {
            icon: 'ep:more'
          })
        })
      }),

      h('style', {
        innerHTML: `
          .readonly-clear-wrapper .clear-icon {
            opacity: 0;
            transition: opacity 0.2s;
            fontSize: '14px';
          }

          .readonly-clear-wrapper:hover .clear-icon {
            opacity: 1;
          }
          .readonly-clear-wrapper .clear-icon:hover {
            color: var(--el-color-primary);
          }
        `
      })
    ])
    
  }

  return {
    inputComp,
    textareaComp,
    numberComp,
    checkboxComp,
    radioComp,
    selectComp,
    dateComp,
    selectInput
  }
}
