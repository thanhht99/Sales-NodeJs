const nodemailer = require('nodemailer');

class MailService{
    transporter;
    static init(){
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.USER_MAIL, 
                pass: process.env.PASS_MAIL 
            },
        });
    }
    static async sendMail(from, to, subject, text, html){
        const info = await this.transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });
        return info;
    }
}

// render = (filename, replacements) => {
//     const source = fs.readFileSync(filename, 'utf8').toString();
//     const template = handlebars.compile(source);
//     const output = template(replacements);
//     return output;
// }
let transporter = nodemailer.createTransport({
    // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_MAIL, //Tài khoản gmail vừa tạo
        pass: process.env.PASS_MAIL //Mật khẩu tài khoản gmail vừa tạo
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

exports.sendEmail = async(req, res, next) => {
    //const htmlToSend =  render(`${__dirname}/../public/teamplate/email.html`,replacements);
    console.log('SendEmail');
    //console.log(req);
    let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Best Seller VN',
        to: req.email,
        subject: 'Verify Code',
        text: 'Thank you for registering an account on our website. ^-^' +
            '\nName: ' + req.name +
            '\nVerify Code: ' + req.verifyCode + '\n'
    }

    console.log(mainOptions);
    // res.status(200).send(req);
    transporter.sendMail(mainOptions, function(error, info) {
        if (error) { // nếu có lỗi
            console.log('Error Occurs');
        } else { //nếu thành công
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendCodeForgotPassword = async(req, res, next) => {
    //const htmlToSend =  render(`${__dirname}/../public/teamplate/email.html`,replacements);
    console.log('SendEmail');
    //console.log(req);
    let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Best Seller VN',
        to: req.email,
        subject: 'Verify Code',
        text: 'Authentication code forgot password: ' + req.verifyCode + '\n'
    }
    console.log(mainOptions);
    // res.status(200).send(req);
    transporter.sendMail(mainOptions, function(error, info) {
        if (error) { // nếu có lỗi
            console.log('Error Occurs');
        } else { //nếu thành công
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendPassword = async(req, res, next) => {
    //const htmlToSend =  render(`${__dirname}/../public/teamplate/email.html`,replacements);
    console.log('SendEmail');
    //console.log(req);
    let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Best Seller VN',
        to: req.email,
        subject: 'New Password',
        text: 'New Password: ' + req.password + '\n'
    }
    console.log(mainOptions);
    // res.status(200).send(req);
    transporter.sendMail(mainOptions, function(error, info) {
        if (error) { // nếu có lỗi
            console.log('Error Occurs');
        } else { //nếu thành công
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.send = async(req, res, next) => {
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/users/resetPassword/${req.resetToken}`;
    const replacements = {
        url: resetURL,
        username: req.user.fullname
    };
    const htmlToSend = render(`${__dirname}/../public/teamplate/email_resetPassword.html`, replacements);
    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Online Banking',
        to: req.body.email,
        subject: 'Reset Password',
        text: 'You recieved message from ' + req.body.email,
        html: htmlToSend
    }
    await transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            return next(new Error());
        }
        console.log(info);
        res.render('checkSMS', {
            email: req.body.email,
            title: 'Login'
        });
    });
}


module.exports = MailService;