/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    console.log(formInfo['colname'])
    switch (formInfo['colname']) {
      case 'ifliveout':
        //add by sxxie 2018.01.29
        //选项2 长期(一年以上)居住地，选择“农村”，同时满足选项3 借款人类型中的“国有农场职工”或者“其他”，则系统判定为农户；
        //项2 长期(一年以上)居住地，选择“农村”，选项3 借款人类型中选择“国有经济的机关、团体、学校、企事业单位的集体户”，则系统判定非农户；
        //选项2 长期(一年以上)居住地，选择“城市”，则系统直接判官为非农户
        //选项4 是否举家外出谋生，选择“一年以上”，则系统直接判官为非农户
        if(props.formData.ifliveout =='3'){
          props.formData.farmersort = '1'
        }else if(props.formData.peresidence == '2' && (props.formData.botype == '1' || props.formData.botype == '3')) {
          props.formData.farmersort = "2"
        }else if ((props.formData.peresidence == "2" && props.formData.botype == "2") || (props.formData.peresidence == "1")) {
          props.formData.farmersort = "1"
        }
        break
      case 'botype':
        //add by sxxie 2018.01.29
        //选项2 长期(一年以上)居住地，选择“农村”，同时满足选项3 借款人类型中的“国有农场职工”或者“其他”，则系统判定为农户；
        //项2 长期(一年以上)居住地，选择“农村”，选项3 借款人类型中选择“国有经济的机关、团体、学校、企事业单位的集体户”，则系统判定非农户；
        //选项2 长期(一年以上)居住地，选择“城市”，则系统直接判官为非农户
        //选项4 是否举家外出谋生，选择“一年以上”，则系统直接判官为非农户
        if(props.formData.ifliveout =='3'){
          props.formData.farmersort = '1'
        }else if(props.formData.peresidence == '2' && (props.formData.botype == '1' || props.formData.botype == '3')) {
          props.formData.farmersort = "2"
        }else if ((props.formData.peresidence == "2" && props.formData.botype == "2") || (props.formData.peresidence == "1")) {
          props.formData.farmersort = "1"
        }
        break
      case 'peresidence':
        //add by sxxie 2018.01.29
        //选项2 长期(一年以上)居住地，选择“农村”，同时满足选项3 借款人类型中的“国有农场职工”或者“其他”，则系统判定为农户；
        //项2 长期(一年以上)居住地，选择“农村”，选项3 借款人类型中选择“国有经济的机关、团体、学校、企事业单位的集体户”，则系统判定非农户；
        //选项2 长期(一年以上)居住地，选择“城市”，则系统直接判官为非农户
        //选项4 是否举家外出谋生，选择“一年以上”，则系统直接判官为非农户
        if(props.formData.ifliveout =='3'){
          props.formData.farmersort = '1'
        }else if(props.formData.peresidence == '2' && (props.formData.botype == '1' || props.formData.botype == '3')) {
          props.formData.farmersort = "2"
        }else if ((props.formData.peresidence == "2" && props.formData.botype == "2") || (props.formData.peresidence == "1")) {
          props.formData.farmersort = "1"
        }
        break
      case 'occupation':
        var occupation = props.formData.occupation;
        var workcorp = props.formData.workcorp;
        if(occupation != 'Y') {
          //职业（Occupation）不为 “Y-客户不愿提供” 时，“不便分类的其他从业人员” 只读、非必输。
          refList.dynamicFormRef.value.setColAttr('profstatus', 'colreadonly','1')
        }else{
          if(workcorp.length == 0 ||workcorp == '无'){
              refList.dynamicFormRef.value.setColAttr('profstatus', 'colreadonly','0')
          }
        }
        break
      default:
        break
    }
  }

  // 点击打开弹窗事件
  const formSelectInputClick = (formInfo) => {
    refList.mapRefs.value[`select${formInfo.colname}InputRef`].open(formInfo)
  }

  // 弹窗确认回调事件
  const popConfirm = (colname, item) => {
    switch (colname) {
      case 'countryname': // 所在国家
        props.formData.countrycode = item.key
        props.formData.countryname = item.title
        break
      case 'nativeplace': // 注册省市区
        props.formData.nativeplace = item.title
        break
      case 'workadd': // 注册省市区
        props.formData.workadd = item.title
        break
      case 'ctcdstccdname': // 注册省市区
        props.formData.ctcdstccd = item.key
        props.formData.ctcdstccdname = item.title
        break
      case 'familyadd': // 注册省市区
        props.formData.familyadd = item.title
        break
      case 'officeaddcodename': // 办公省市区
        props.formData.officeaddcode = item.key
        props.formData.officeaddcodename = item.title
        break
      case 'entorgtypename': // 办公省市区
        props.formData.entorgtypename = item.title
        break
      case 'creditbelongname': // 信用等级评估模板名称
        props.formData.creditbelong = item.key
        props.formData.creditbelongname = item.title
        break
      case 'unitkindname': // 国标行业分类
        props.formData.unitkind = item.key
        props.formData.unitkindname = item.title
        break
      default:
        break
    }
  }

  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {
    // 长期(一年以上)居住地为 “2-农村” 时展示 “举家外出谋生时间”，为 “1-城市” 时隐藏。
    ifliveout: () => props.formData['peresidence'] == '2',
    // 职业（Occupation）为“农民、学生、军人、客户不愿提供、未知” 时，“单位性质、职务、职称、本单位工作起始日”字段隐藏非必输，“单位地址、单位所属行业”字段非必输，“具体职务、职务年限”字段隐藏。
    headship: () => !['27', '31', 'Y', 'X', 'Z'].includes(props.formData['occupation']),
    position: () => !['27', '31', 'Y', 'X', 'Z'].includes(props.formData['occupation']),
    workbegindate: () => !['27', '31', 'Y', 'X', 'Z'].includes(props.formData['occupation']),
    headshipdetail: () => !['27', '31', 'Y', 'X', 'Z'].includes(props.formData['occupation']),
    headshiptime: () => !['27', '31', 'Y', 'X', 'Z'].includes(props.formData['occupation']),
  }

  /**
   * 自定义字段必录逻辑
   */
  const customRequired = {
    mfcustomerid: () => props.formData['countryname'] == '中国',    //职业（Occupation）不为 “Y-客户不愿提供” 时，“不便分类的其他从业人员” 只读、非必输。
    // 职业（Occupation）为 “Y-客户不愿提供” 时，判断 “单位名称” 是否填写，未填写时 “不便分类的其他从业人员” 必输、非只读。
    profstatus :() => props.formData['occupation'] == 'Y' && (props.formData['workcorp'].length == 0 || props.formData['workcorp']== '无'),
    headship: () => !['27', '31','Y','X','Z'].includes(props.formData['occupation']),
    position: () => !['27', '31','Y','X','Z'].includes(props.formData['occupation']),
    workbegindate: () => !['27', '31','Y','X','Z'].includes(props.formData['occupation']),
    headshipdetail: () => !['27', '31','Y','X','Z'].includes(props.formData['occupation']),
    headshiptime: () => !['27', '31','Y','X','Z'].includes(props.formData['occupation']),

  }
  /**
   * 自定义字段只读逻辑
   */
  const customReadonly = {
    profstatus: () => (props.formData['occupation'] == 'Y' && (props.formData['workcorp'].length != 0 && props.formData['workcorp'] != '无')) || props.formData['occupation'] != 'Y'
  }
  

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customRequired,
    customReadonly
  }
}
