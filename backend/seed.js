require('dotenv').config()
const connectDB = require('./config/db')
const bcrypt = require('bcryptjs')
const userModel = require('./models/userModel')
const productModel = require('./models/productModel')

async function seed(){
    await connectDB()

    // Create admin user if not exists
    const adminEmail = 'admin@example.com'
    const existingAdmin = await userModel.findOne({ email: adminEmail })
    const SERVER = process.env.SERVER_DOMAIN || 'http://localhost:8080'
    const defaultAdminPic = `/assets/products/watches/boAt%20Wave%20Style%20Call%201.webp`

    if(!existingAdmin){
        const salt = bcrypt.genSaltSync(10)
        const hashed = bcrypt.hashSync('Admin123!', salt)
        const admin = new userModel({ name: 'Admin', email: adminEmail, password: hashed, role: 'ADMIN', profilePic: defaultAdminPic })
        await admin.save()
        console.log('Created admin user ->', adminEmail)
    } else {
        // if admin exists but no profilePic set, add default
        if(!existingAdmin.profilePic){
            await userModel.updateOne({ email: adminEmail }, { $set: { profilePic: defaultAdminPic } })
            console.log('Updated admin profilePic')
        }
        console.log('Admin already exists ->', adminEmail)
    }

    // Create sample products if none exist
    const count = await productModel.countDocuments()

    // ✅ CANONICAL CATEGORIES - These MUST match Home.js exactly
    const CATEGORIES = {
        televisions: 'televisions',
        camera: 'camera',
        speakers: 'speakers',
        airpodes: 'airpodes',
        earphones: 'earphones',
        watches: 'watches',
        mobiles: 'mobiles',
        Mouse: 'Mouse',
        printers: 'printers',
        processor: 'processor',
        refrigerator: 'refrigerator',
        trimmers: 'trimmers'
    }

    // Normalize ALL existing products with incorrect category names
    const categoryNormalizations = [
        // Televisions variants
        { from: 'TV', to: CATEGORIES.televisions },
        { from: 'Televisions', to: CATEGORIES.televisions },
        { from: 'Television', to: CATEGORIES.televisions },
        { from: 'tv', to: CATEGORIES.televisions },
        // Speakers variants
        { from: 'Speakers', to: CATEGORIES.speakers },
        { from: 'Bluetooth Speakers', to: CATEGORIES.speakers },
        { from: 'speaker', to: CATEGORIES.speakers },
        // Mobile variants
        { from: 'mobile', to: CATEGORIES.mobiles },
        { from: 'Mobile', to: CATEGORIES.mobiles },
        { from: 'Mobiles', to: CATEGORIES.mobiles },
        // Refrigerator variants
        { from: 'Refrigerator', to: CATEGORIES.refrigerator },
        // Trimmers variants
        { from: 'Trimmers', to: CATEGORIES.trimmers },
        // Mouse variants
        { from: 'mouse', to: CATEGORIES.Mouse },
        { from: 'mice', to: CATEGORIES.Mouse },
        { from: 'Mice', to: CATEGORIES.Mouse }
    ]

    console.log('\n📋 Normalizing existing categories...')
    for(const normalization of categoryNormalizations){
        const count = await productModel.countDocuments({ category: normalization.from })
        if(count > 0){
            await productModel.updateMany({ category: normalization.from }, { $set: { category: normalization.to } })
            console.log(`  ✓ ${count} products: '${normalization.from}' → '${normalization.to}'`)
        }
    }

    const imgUrl = (category, filename) => `/assets/products/${category}/${encodeURIComponent(filename)}`

    // Dynamically generate sample products by scanning frontend assets
    const fs = require('fs')
    const path = require('path')
    const productAssetsDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'products')

    // Map folder names to canonical category names (to match Home.js and database)
    const categoryMap = {
        'TV': 'televisions',
        'tv': 'televisions',
        'Televisions': 'televisions',
        'televisions': 'televisions',
        'mobile': 'mobiles',
        'Mobile': 'mobiles',
        'mobiles': 'mobiles',
        'Mobiles': 'mobiles',
        'speakers': 'speakers',
        'Speakers': 'speakers',
        'Bluetooth Speakers': 'speakers',
        'refrigerator': 'refrigerator',
        'Refrigerator': 'refrigerator',
        'trimmers': 'trimmers',
        'Trimmers': 'trimmers',
        'mouse': 'Mouse',
        'Mouse': 'Mouse',
        'mice': 'Mouse',
        'Mice': 'Mouse'
    }

    const getCanonicalCategory = (folderName) => {
        return categoryMap[folderName] || folderName.toLowerCase()
    }

    const productsToInsert = []
    try{
        if(fs.existsSync(productAssetsDir)){
            const categories = fs.readdirSync(productAssetsDir).filter(f => fs.statSync(path.join(productAssetsDir, f)).isDirectory())
            for(const cat of categories){
                const canonicalCategory = getCanonicalCategory(cat)
                const files = fs.readdirSync(path.join(productAssetsDir, cat)).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                for(const file of files){
                    const name = path.parse(file).name.replace(/[_\-]+/g,' ').trim()
                    const base = Math.floor(Math.random() * 90000) + 1000
                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))

                    productsToInsert.push({
                        productName: name,
                        brandName: canonicalCategory.charAt(0).toUpperCase() + canonicalCategory.slice(1),
                        category: canonicalCategory,
                        productImage: [ imgUrl(cat, file) ],
                        description: `Sample ${canonicalCategory} - ${name}`,
                        price: base,
                        sellingPrice: selling
                    })

                    // allow more products (we'll ensure watches count separately)
                    if(productsToInsert.length >= 200) break
                }
                if(productsToInsert.length >= 200) break
            }

            // Ensure at least 50 watch products exist (either in DB or to be inserted)
            const watchDir = path.join(productAssetsDir, 'watches')
            const existingWatchesInInsert = productsToInsert.filter(p => p.category === 'watches').length
            const existingWatchesInDB = await productModel.countDocuments({ category: 'watches' })
            const totalExistingWatches = existingWatchesInInsert + existingWatchesInDB
            const targetWatches = 50

            if(totalExistingWatches < targetWatches){
                const needed = targetWatches - totalExistingWatches
                if(fs.existsSync(watchDir)){
                    const watchFiles = fs.readdirSync(watchDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                    if(watchFiles.length === 0){
                        console.log('No image files found in watches folder, cannot generate extra watch products')
                    } else {
                        for(let i = 0; i < needed; i++){
                            const file = watchFiles[i % watchFiles.length]
                            const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || `Watch`
                            const uniqueName = `${baseName} ${existingWatchesInDB + existingWatchesInInsert + i + 1}`
                            const base = Math.floor(Math.random() * 90000) + 1000
                            const selling = Math.floor(base * (0.6 + Math.random() * 0.3))

                            productsToInsert.push({
                                productName: uniqueName,
                                brandName: 'Watches',
                                category: 'watches',
                                productImage: [ imgUrl('watches', file) ],
                                description: `Sample watches - ${uniqueName}`,
                                price: base,
                                sellingPrice: selling
                            })
                        }
                        console.log(`Added ${needed} extra watch products to reach ${targetWatches} watches`)
                    }
                } else {
                    console.log('Watches assets folder not found, cannot add extra watch products')
                }
            }

            // Normalize any existing 'mobile' categories to 'mobiles' (user requested canonical 'mobiles')
            const mobileCountInDB = await productModel.countDocuments({ category: 'mobile' })
            if(mobileCountInDB > 0){
                await productModel.updateMany({ category: 'mobile' }, { $set: { category: 'mobiles' } })
                console.log(`Normalized ${mobileCountInDB} products from 'mobile' to 'mobiles'`)
            }

            // Ensure at least target mobile products exist (use 'mobiles' as category)
            const mobileDir = path.join(productAssetsDir, 'mobile')
            const mobilesDir = path.join(productAssetsDir, 'mobiles')
            let mobileDirFound = null
            if(fs.existsSync(mobilesDir)) mobileDirFound = mobilesDir
            else if(fs.existsSync(mobileDir)) mobileDirFound = mobileDir

            if(mobileDirFound){
                const folderName = 'mobiles' // canonical category
                const existingMobilesInInsert = productsToInsert.filter(p => p.category === folderName).length
                const existingMobilesInDB = await productModel.countDocuments({ category: 'mobiles' })
                const totalExistingMobiles = existingMobilesInInsert + existingMobilesInDB
                const targetMobiles = 100
                console.log(`Mobile folder detected: '${path.basename(mobileDirFound)}' — in-db=${existingMobilesInDB}, queued=${existingMobilesInInsert}, totalIfInserted=${totalExistingMobiles}`)
                if(totalExistingMobiles < targetMobiles){
                    const needed = targetMobiles - totalExistingMobiles
                    const mobileFiles = fs.readdirSync(mobileDirFound).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                    if(mobileFiles.length === 0){
                        console.log('No image files found in mobile/mobiles folder, cannot generate extra mobile products')
                    } else {
                        for(let i=0;i<needed;i++){
                            const file = mobileFiles[i % mobileFiles.length]
                            const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || 'Mobile'
                            const uniqueName = `${baseName} ${existingMobilesInDB + existingMobilesInInsert + i + 1}`
                            const base = Math.floor(Math.random() * 90000) + 1000
                            const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                            productsToInsert.push({
                                productName: uniqueName,
                                brandName: folderName.charAt(0).toUpperCase() + folderName.slice(1),
                                category: folderName,
                                productImage: [ imgUrl(folderName === 'mobiles' ? 'mobile' : folderName, file) ],
                                description: `Sample ${folderName} - ${uniqueName}`,
                                price: base,
                                sellingPrice: selling
                            })
                        }
                        console.log(`Added ${needed} extra mobile products to reach ${targetMobiles} mobiles`)
                    }
                } else {
                    console.log(`Mobiles already meet target (${totalExistingMobiles} >= ${targetMobiles}), no extra mobiles added`)
                }
            } else {
                console.log('Mobile assets folder not found, cannot add extra mobile products')
            }

                    // Normalize lower-case 'mouse'/'mice' to capitalized 'Mouse' category
                    const mouseLowerCount = await productModel.countDocuments({ $or: [ { category: 'mouse' }, { category: 'mice' } ] })
                    if(mouseLowerCount > 0){
                        await productModel.updateMany({ $or: [ { category: 'mouse' }, { category: 'mice' } ] }, { $set: { category: 'Mouse' } })
                        console.log(`Normalized ${mouseLowerCount} products to category 'Mouse'`)
                    }

                    // Ensure at least 50 Mouse products exist (either in DB or to be inserted)
                    const mouseDir = path.join(productAssetsDir, 'mouse')
                    const miceDir = path.join(productAssetsDir, 'mice')
                    let mouseDirFound = null
                    if(fs.existsSync(miceDir)) mouseDirFound = miceDir
                    else if(fs.existsSync(mouseDir)) mouseDirFound = mouseDir

                    if(mouseDirFound){
                        const folderName = path.basename(mouseDirFound)
                        const canonicalCategory = 'Mouse'
                        const existingMiceInInsert = productsToInsert.filter(p => p.category === canonicalCategory).length
                        const existingMiceInDB = await productModel.countDocuments({ category: canonicalCategory })
                        const totalExistingMice = existingMiceInInsert + existingMiceInDB
                        const targetMice = 50
                        console.log(`Mouse folder detected: '${folderName}' — in-db=${existingMiceInDB}, queued=${existingMiceInInsert}, totalIfInserted=${totalExistingMice}`)
                        if(totalExistingMice < targetMice){
                            const needed = targetMice - totalExistingMice
                            const mouseFiles = fs.readdirSync(mouseDirFound).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                            if(mouseFiles.length === 0){
                                console.log('No image files found in mouse/mice folder, cannot generate extra Mouse products')
                            } else {
                                for(let i = 0; i < needed; i++){
                                    const file = mouseFiles[i % mouseFiles.length]
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || 'Mouse'
                                    const uniqueName = `${baseName} ${existingMiceInDB + existingMiceInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))

                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Mouse',
                                        category: canonicalCategory,
                                        productImage: [ imgUrl(folderName === 'mice' || folderName === 'mouse' ? 'mouse' : folderName, file) ],
                                        description: `Sample ${canonicalCategory} - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`Added ${needed} extra Mouse products to reach ${targetMice} Mouse items`)
                            }
                        } else {
                            console.log(`Mouse already meet target (${totalExistingMice} >= ${targetMice}), no extra Mouse added`)
                        }
                    } else {
                        console.log('Mouse assets folder not found, cannot add extra Mouse products')
                    }

                    // ✅ TELEVISIONS - Ensure at least 50 television products exist
                    const tvCandidates = ['TV','tv','television','televisions','TVs','tvS']
                    const tvDirFound = tvCandidates.map(n => path.join(productAssetsDir, n)).find(p => fs.existsSync(p))
                    if(tvDirFound){
                        const folderName = path.basename(tvDirFound)
                        const canonicalCategory = CATEGORIES.televisions // ✅ Use canonical 'televisions'
                        const existingTVInInsert = productsToInsert.filter(p => p.category === canonicalCategory).length
                        const existingTVInDB = await productModel.countDocuments({ category: canonicalCategory })
                        const totalExistingTV = existingTVInInsert + existingTVInDB
                        const targetTV = 50
                        console.log(`\n📺 TV folder detected: '${folderName}' — in-db=${existingTVInDB}, queued=${existingTVInInsert}, total=${totalExistingTV}`)
                        if(totalExistingTV < targetTV){
                            const needed = targetTV - totalExistingTV
                            const tvFiles = fs.readdirSync(tvDirFound).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                            if(tvFiles.length === 0){
                                console.log('  ⚠️  No image files found in TV folder')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = tvFiles[i % tvFiles.length]
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || 'Television'
                                    const uniqueName = `${baseName} ${existingTVInDB + existingTVInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Television',
                                        category: canonicalCategory,
                                        productImage: [ imgUrl(folderName, file) ],
                                        description: `Sample television - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`  ✓ Added ${needed} television products`)
                            }
                        } else {
                            console.log(`  ✓ Televisions already meet target (${totalExistingTV} >= ${targetTV})`)
                        }
                    } else {
                        console.log('  ⚠️  TV assets folder not found')
                    }

                    // ✅ BLUETOOTH SPEAKERS - Ensure at least 50 speaker products exist
                    const spDir = path.join(productAssetsDir, 'speakers')
                    if(fs.existsSync(spDir)){
                        const speakerFiles = fs.readdirSync(spDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const canonicalCategory = CATEGORIES.speakers // ✅ Use canonical 'speakers'
                        const existingSpeakersInDB = await productModel.countDocuments({ category: canonicalCategory })
                        const existingSpeakersInInsert = productsToInsert.filter(p => p.category === canonicalCategory).length
                        const totalExistingSpeakers = existingSpeakersInDB + existingSpeakersInInsert
                        const targetSpeakers = 50
                        console.log(`\n🔊 Speakers folder detected — in-db=${existingSpeakersInDB}, queued=${existingSpeakersInInsert}, total=${totalExistingSpeakers}`)
                        if(totalExistingSpeakers < targetSpeakers){
                            const needed = targetSpeakers - totalExistingSpeakers
                            if(speakerFiles.length === 0){
                                console.log('  ⚠️  No image files found in speakers folder')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = speakerFiles[i % speakerFiles.length]
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim()
                                    const uniqueName = `${baseName} ${existingSpeakersInDB + existingSpeakersInInsert + i + 1}`
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Speakers',
                                        category: canonicalCategory,
                                        productImage: [ imgUrl('speakers', file) ],
                                        description: `Bluetooth Speakers - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`  ✓ Added ${needed} speaker products`)
                            }
                        } else {
                            console.log(`  ✓ Speakers already meet target (${totalExistingSpeakers} >= ${targetSpeakers})`)
                        }
                    } else {
                        console.log('  ⚠️  Speakers assets folder not found')
                    }

                    // ✅ CAMERA - Ensure at least 30 camera products exist
                    const camDir = path.join(productAssetsDir, 'camera')
                    if(fs.existsSync(camDir)){
                        const cameraFiles = fs.readdirSync(camDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const cameraCat = CATEGORIES.camera // ✅ Use canonical 'camera'
                        const existingCameraInDB = await productModel.countDocuments({ category: cameraCat })
                        const existingCameraInInsert = productsToInsert.filter(p => p.category === cameraCat).length
                        const totalExistingCamera = existingCameraInInsert + existingCameraInDB
                        const targetCamera = 30
                        console.log(`\n📷 Camera folder detected — in-db=${existingCameraInDB}, queued=${existingCameraInInsert}, total=${totalExistingCamera}`)
                        if(totalExistingCamera < targetCamera){
                            const needed = targetCamera - totalExistingCamera
                            if(cameraFiles.length === 0){
                                console.log('  ⚠️  No image files found in camera folder')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = cameraFiles[i % cameraFiles.length]
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim()
                                    const uniqueName = `${baseName} ${existingCameraInDB + existingCameraInInsert + i + 1}`
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Camera',
                                        category: cameraCat,
                                        productImage: [ imgUrl('camera', file) ],
                                        description: `Camera & Photography - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`  ✓ Added ${needed} camera products`)
                            }
                        } else {
                            console.log(`  ✓ Camera already meet target (${totalExistingCamera} >= ${targetCamera})`)
                        }
                    } else {
                        console.log('  ⚠️  Camera assets folder not found')
                    }

                    // ✅ REFRIGERATOR - Ensure at least 20 refrigerator products exist
                    const refDir = path.join(productAssetsDir, 'refrigerator')
                    if(fs.existsSync(refDir)){
                        const refFiles = fs.readdirSync(refDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const refCat = CATEGORIES.refrigerator // ✅ Use canonical 'refrigerator'
                        const existingRefInDB = await productModel.countDocuments({ category: refCat })
                        const existingRefInInsert = productsToInsert.filter(p => p.category === refCat).length
                        const totalExistingRef = existingRefInDB + existingRefInInsert
                        const targetRef = 20
                        console.log(`\n❄️  Refrigerator folder detected — in-db=${existingRefInDB}, queued=${existingRefInInsert}, total=${totalExistingRef}`)
                        if(totalExistingRef < targetRef){
                            const needed = targetRef - totalExistingRef
                            if(refFiles.length === 0){
                                console.log('  ⚠️  No image files found in refrigerator folder')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = refFiles[i % refFiles.length]
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim()
                                    const uniqueName = `${baseName} ${existingRefInDB + existingRefInInsert + i + 1}`
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Refrigerator',
                                        category: refCat,
                                        productImage: [ imgUrl('refrigerator', file) ],
                                        description: `Refrigerator - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`  ✓ Added ${needed} refrigerator products`)
                            }
                        } else {
                            console.log(`  ✓ Refrigerators already meet target (${totalExistingRef} >= ${targetRef})`)
                        }
                    } else {
                        console.log('  ⚠️  Refrigerator assets folder not found')
                    }

                    // ✅ TRIMMERS - Ensure at least 20 trimmer products exist
                    const trimDir = path.join(productAssetsDir, 'trimmers')
                    if(fs.existsSync(trimDir)){
                        const trimFiles = fs.readdirSync(trimDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const trimCat = CATEGORIES.trimmers // ✅ Use canonical 'trimmers'
                        const existingTrimInDB = await productModel.countDocuments({ category: trimCat })
                        const existingTrimInInsert = productsToInsert.filter(p => p.category === trimCat).length
                        const totalExistingTrim = existingTrimInDB + existingTrimInInsert
                        const targetTrim = 20
                        console.log(`\n✂️  Trimmers folder detected — in-db=${existingTrimInDB}, queued=${existingTrimInInsert}, total=${totalExistingTrim}`)
                        if(totalExistingTrim < targetTrim){
                            const needed = targetTrim - totalExistingTrim
                            if(trimFiles.length === 0){
                                console.log('  ⚠️  No image files found in trimmers folder')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = trimFiles[i % trimFiles.length]
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim()
                                    const uniqueName = `${baseName} ${existingTrimInDB + existingTrimInInsert + i + 1}`
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Trimmers',
                                        category: trimCat,
                                        productImage: [ imgUrl('trimmers', file) ],
                                        description: `Trimmer - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`  ✓ Added ${needed} trimmer products`)
                            }
                        } else {
                            console.log(`  ✓ Trimmers already meet target (${totalExistingTrim} >= ${targetTrim})`)
                        }
                    } else {
                        console.log('  ⚠️  Trimmers assets folder not found')
                    }
        }
    }catch(err){
        console.error('Error scanning assets',err)
    }

    // Upsert sample products so running seed repeatedly won't duplicate
    console.log('\n📦 Upserting products into database...')
    for(const p of productsToInsert){
        await productModel.findOneAndUpdate({ productName: p.productName }, { $setOnInsert: p }, { upsert: true })
    }
    console.log(`✓ Seeded/Updated ${productsToInsert.length} products\n`)

    // ✅ FINAL VERIFICATION - Show category counts
    console.log('📊 Final Product Counts by Category:')
    const categoryCheck = [
        'televisions',
        'camera',
        'speakers',
        'airpodes',
        'earphones',
        'watches',
        'mobiles',
        'Mouse',
        'printers',
        'processor',
        'refrigerator',
        'trimmers'
    ]
    for(const cat of categoryCheck){
        const count = await productModel.countDocuments({ category: cat })
        if(count > 0){
            console.log(`  ✓ ${cat}: ${count} products`)
        }
    }

    console.log('\n✅ Database seeding complete!')
    console.log('Ready for production.\n')
    process.exit(0)


    process.exit(0)
}

seed().catch(err=>{
    console.error(err)
    process.exit(1)
})