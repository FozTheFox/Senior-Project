
import { NextResponse } from 'next/server';
import omise from "../../../../lib/omise";

export async function POST(request) {
  try {
    const body = await request.json();  // รับจำนวนเงินจาก client
    
    // สร้าง PromptPay QR Code source ผ่าน Omise API
    const source = await new Promise((resolve, reject) => {
      omise.sources.create({
        type: 'promptpay',
        amount: body.total * 100,  // จำนวนเงิน (หน่วยสตางค์)
        currency: 'thb',      // สกุลเงิน
      }, (error, source) => {
        if (error) {
          return reject(error);  // ถ้ามี error ให้ปฏิเสธคำขอ
        }
        resolve(source);  // ส่งข้อมูล source กลับมา
      });
    });


    // สร้างรายการรับชำระเงิน
    const charge = await new Promise((resolve, reject) => {
      omise.charges.create({
        amount: body.total * 100,  // จำนวนเงิน (หน่วยสตางค์)
        currency: 'thb',      // สกุลเงิน
        source: source.id,    // ใช้ source ID ที่ได้จากการสร้าง QR Code
      }, (error, charge) => {
        if (error) {
          return reject(error);  // ถ้ามี error ให้ปฏิเสธคำขอ
        }
        resolve(charge);  // ส่งข้อมูล charge กลับมา
      });
    });
    // console.log('download_uriดูcharge object:', JSON.stringify(charge, null, 2));

    let qrCodeUrl;
    if (charge.source.scannable_code && charge.source.scannable_code.image && charge.source.scannable_code.image.download_uri) {
      qrCodeUrl = charge.source.scannable_code.image.download_uri;
    } else {
      throw new Error('Invalid source structure: scannable_code or image is missing');
    }
    // ส่งข้อมูลกลับไปที่ client
    return NextResponse.json({
      success: true,
      data: {
        source,
        charge,
        
      },
      qrCodeUrl,
      
    });
  } catch (error) {
    console.error('Error creating QR code or charge:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}