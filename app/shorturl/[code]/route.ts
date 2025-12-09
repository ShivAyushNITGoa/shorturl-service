import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  try {
    // Get short URL from database
    const { data, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', code)
      .single();

    if (error || !data) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Short URL Not Found</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #b0b91a 0%, #667eea 100%);
            }
            .container {
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            h1 { color: #333; margin: 0 0 10px 0; }
            p { color: #666; margin: 0; }
            a { color: #667eea; text-decoration: none; font-weight: 600; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔗 Short URL Not Found</h1>
            <p>The short code "<strong>${code}</strong>" does not exist.</p>
            <p style="margin-top: 20px;"><a href="https://extensions.thegdevelopers.online">← Back to Home</a></p>
          </div>
        </body>
        </html>
        `,
        { 
          status: 404,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Increment clicks
    await supabase
      .from('short_urls')
      .update({ clicks: data.clicks + 1 })
      .eq('id', data.id);

    // Log click analytics if table exists
    try {
      await supabase
        .from('click_analytics')
        .insert({
          short_url_id: data.id,
          user_agent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer'),
        });
    } catch (e) {
      // Analytics table might not exist yet, continue anyway
      console.log('Analytics logging skipped');
    }

    // Redirect to long URL
    return Response.redirect(data.long_url, 301);
  } catch (error) {
    console.error('Redirect error:', error);
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #b0b91a 0%, #667eea 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          h1 { color: #333; margin: 0 0 10px 0; }
          p { color: #666; margin: 0; }
          a { color: #667eea; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ Error Processing Redirect</h1>
          <p>Something went wrong. Please try again later.</p>
          <p style="margin-top: 20px;"><a href="https://extensions.thegdevelopers.online">← Back to Home</a></p>
        </div>
      </body>
      </html>
      `,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
